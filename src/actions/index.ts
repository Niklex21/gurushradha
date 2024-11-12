import type { InstagramPost } from "@/types";
import { defineAction } from "astro:actions";

export const server = {
  fetchInstagramPosts: defineAction({
    handler: async () => {
      const INSTAGRAM_ACCESS_KEY = import.meta.env.INSTAGRAM_ACCESS_KEY;
      const INSTAGRAM_APP_ID = import.meta.env.INSTAGRAM_APP_ID;

      console.log(import.meta.env.INSTAGRAM_ACCESS_KEY);
      console.log(import.meta.env.INSTAGRAM_APP_ID);

      const response = await fetch(
        "https://graph.instagram.com/v21.0/" +
          INSTAGRAM_APP_ID +
          "/media?fields=permalink&access_token=" +
          INSTAGRAM_ACCESS_KEY,
      );

      return (await response.json()).data as InstagramPost[];
    },
  }),
};
