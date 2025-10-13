import type { InstagramChildPost, InstagramPost } from "@/types";
import { defineAction } from "astro:actions";

export const server = {
  fetchInstagramPosts: defineAction({
    handler: async ({ limit = 5 }: { limit: number }) => {
      const INSTAGRAM_ACCESS_KEY = import.meta.env.INSTAGRAM_ACCESS_KEY;
      const INSTAGRAM_APP_ID = import.meta.env.INSTAGRAM_APP_ID;
      
      if (!INSTAGRAM_ACCESS_KEY || !INSTAGRAM_APP_ID) {
        throw new Error("Missing required Instagram environment variables");
      }

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
        `${INSTAGRAM_BASE_URL}${INSTAGRAM_APP_ID}/media?fields=${fields.join(",")}&access_token=${INSTAGRAM_ACCESS_KEY}&limit=${limit}`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Instagram API error: ${error.error?.message || 'Unknown error'}`);
      }

      let posts = (await response.json()).data;

      posts = (await Promise.all(
        posts.map(async (post: any) => {
          if (post.media_type === "CAROUSEL_ALBUM" && post.children?.data) {
            const childData = await Promise.all(
              post.children.data.map(async (child: { id: string }) => {
                const response = await fetch(
                  `${INSTAGRAM_BASE_URL}${child.id}?fields=id,media_type,media_url&access_token=${INSTAGRAM_ACCESS_KEY}`,
                );
                
                if (!response.ok) {
                  const error = await response.json();
                  throw new Error(`Instagram API error fetching child post: ${error.error?.message || 'Unknown error'}`);
                }

                return response.json() as Promise<InstagramChildPost>;
              }),
            );

            return {
              ...post,
              children: childData,
            };
          }
          return post;
        }),
      )) as InstagramPost[];

      return {
        posts
      };
    }
  })
};
