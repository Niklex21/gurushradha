import type { InstagramChildPost, InstagramPost } from "@/types";
import { defineAction } from "astro:actions";
import InstagramAuthService from "@/lib/instagram-auth";

export const server = {
  fetchInstagramPosts: defineAction({
    handler: async ({ limit = 5 }: { limit: number }) => {
      try {
        const authService = InstagramAuthService.getInstance();
        await authService.initialize();
        
        const accessToken = await authService.getValidAccessToken();
        const INSTAGRAM_APP_ID = import.meta.env.INSTAGRAM_APP_ID;

        const fields = [
          "permalink",
          "caption",
          "media_url",
          "media_type",
          "thumbnail_url",
          "children",
        ];

        const INSTAGRAM_BASE_URL = "https://graph.instagram.com/v21.0/";

        const response = await fetch(
          INSTAGRAM_BASE_URL +
            INSTAGRAM_APP_ID +
            `/media?fields=${fields.join(",")}&access_token=` +
            accessToken +
            `&limit=${limit}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Instagram API error: ${errorData.error?.message || response.statusText}`);
        }

        let posts = (await response.json()).data;
        posts = (await Promise.all(
          posts.map(async (post: any) => {
            if (post.media_type === "CAROUSEL_ALBUM" && post.children?.data) {
              const fetchChildPosts = async () => {
                const childData = await Promise.all(
                  post.children!.data.map(async (child: { id: string }) => {
                    const response = await fetch(
                      `https://graph.instagram.com/v21.0/${child.id}?fields=id,media_type,media_url&access_token=${accessToken}`,
                    );
                    
                    if (!response.ok) {
                      console.error(`Failed to fetch child post ${child.id}`);
                      return null;
                    }
                    
                    return response.json() as Promise<InstagramChildPost>;
                  }),
                );

                return childData.filter(Boolean); // Remove null entries
              };

              return {
                ...post,
                children: await fetchChildPosts(),
              };
            } else {
              return post;
            }
          }),
        )) as any as InstagramPost[];

        return posts;
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        throw error;
      }
    },
  }),

  // New action for handling OAuth callback
  handleInstagramCallback: defineAction({
    handler: async ({ code }: { code: string }) => {
      try {
        const authService = InstagramAuthService.getInstance();
        await authService.exchangeCodeForToken(code);
        return { success: true, message: "Instagram authentication successful" };
      } catch (error) {
        console.error('Error handling Instagram callback:', error);
        throw error;
      }
    },
  }),

  // New action for getting authorization URL
  getInstagramAuthUrl: defineAction({
    handler: async () => {
      const authService = InstagramAuthService.getInstance();
      return { authUrl: authService.getAuthorizationUrl() };
    },
  }),
};
