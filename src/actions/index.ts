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
      const mediaUrl = new URL(
        `${INSTAGRAM_BASE_URL}${INSTAGRAM_APP_ID}/media`,
      );
      mediaUrl.searchParams.set("fields", fields.join(","));
      mediaUrl.searchParams.set("access_token", INSTAGRAM_ACCESS_KEY);
      mediaUrl.searchParams.set("limit", String(limit));

      const response = await fetch(mediaUrl);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          `Instagram API error: ${payload.error?.message || "Unknown error"}`,
        );
      }

      let posts = payload.data;
      posts = (await Promise.all(
        posts.map(async (post: any) => {
          if (post.media_type === "CAROUSEL_ALBUM" && post.children?.data) {
            const fetchChildPosts = async () => {
              const childData = await Promise.all(
                post.children!.data.map(async (child: { id: string }) => {
                  const childUrl = new URL(
                    `${INSTAGRAM_BASE_URL}${child.id}`,
                  );
                  childUrl.searchParams.set(
                    "fields",
                    "id,media_type,media_url",
                  );
                  childUrl.searchParams.set(
                    "access_token",
                    INSTAGRAM_ACCESS_KEY,
                  );

                  const childResponse = await fetch(childUrl);
                  const childPayload = await childResponse.json();

                  if (!childResponse.ok) {
                    throw new Error(
                      `Instagram API error fetching child post: ${childPayload.error?.message || "Unknown error"}`,
                    );
                  }

                  return childPayload as InstagramChildPost;
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

      return { posts };
    },
  }),
};
