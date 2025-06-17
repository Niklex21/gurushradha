import type { InstagramChildPost, InstagramPost } from "@/types";
import { defineAction } from "astro:actions";

export const server = {
  fetchInstagramPosts: defineAction({
    handler: async ({ limit = 5 }: { limit: number }) => {
      const INSTAGRAM_ACCESS_KEY = import.meta.env.INSTAGRAM_ACCESS_KEY;
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
          INSTAGRAM_ACCESS_KEY +
          `&limit=${limit}`,
      );

      let posts = (await response.json()).data;
      posts = (await Promise.all(
        posts.map(async (post: any) => {
          if (post.media_type === "CAROUSEL_ALBUM" && post.children?.data) {
            const fetchChildPosts = async () => {
              const childData = await Promise.all(
                post.children!.data.map(async (child: { id: string }) => {
                  const response = await fetch(
                    `https://graph.instagram.com/v21.0/${child.id}?fields=id,media_type,media_url&access_token=${INSTAGRAM_ACCESS_KEY}`,
                  );
                  return response.json() as Promise<InstagramChildPost>;
                }),
              );

              return childData;
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
    },
  }),
};
