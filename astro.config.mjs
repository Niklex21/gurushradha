// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import { loadEnv } from "vite";
import { storyblok } from "@storyblok/astro";

import vercel from "@astrojs/vercel/serverless";

const env = loadEnv("", process.cwd(), "STORYBLOK");

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      components: {
        page: "storyblok/Page",
        global_reference: "storyblok/GlobalReference",
        navbar: "storyblok/Navbar",
        social_link: "storyblok/SocialLink",
        hero: "storyblok/Hero",
        instagram_feed: "storyblok/InstagramFeed",
        section: "storyblok/Section",
        home_main_text: "storyblok/HomeMainText",
        vision: "storyblok/Vision",
        testimonials: "storyblok/Testimonials",
        events: "storyblok/Events",
        home_testimonials: "storyblok/HomeTestimonials",
        home_events: "storyblok/HomeEvents",
        ensemble: "storyblok/Ensemble",
      },
      apiOptions: {
        // Choose your Storyblok space region
        region: "us", // optional,  or 'eu' (default)
      },
    }),
  ],
  output: "server",
  adapter: vercel(),
  redirects: {
    "/": "/home",
  },
});
