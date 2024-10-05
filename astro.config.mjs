// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
import storyblok from '@storyblok/astro';

import vercel from '@astrojs/vercel/serverless';

const env = loadEnv('', process.cwd(), 'STORYBLOK');

// https://astro.build/config
export default defineConfig({
  integrations: [
      tailwind({
          applyBaseStyles: false,
      }),
      react(),
      storyblok({
          accessToken: env.STORYBLOK_TOKEN,
          components: {
              // Add your components here
          },
          apiOptions: {
              // Choose your Storyblok space region
              region: 'us', // optional,  or 'eu' (default)
          },
      }),
  ],

  output: 'server',
  adapter: vercel(),
});