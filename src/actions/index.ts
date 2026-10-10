import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { instagram } from "../lib/instagram-runtime";

export const server = {
  fetchInstagramPosts: defineAction({
    input: z.object({ limit: z.number().int().min(1).max(25).default(5) }),
    handler: async ({ limit }) => {
      const feed = await instagram.getFeed();
      return { ...feed, posts: feed.posts.slice(0, limit) };
    },
  }),
};
