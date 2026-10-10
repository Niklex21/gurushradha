import { createInstagramService } from "./instagram";

export const instagram = createInstagramService({
  env: {
    INSTAGRAM_ACCESS_KEY:
      process.env.INSTAGRAM_ACCESS_KEY ?? import.meta.env.INSTAGRAM_ACCESS_KEY,
    INSTAGRAM_APP_ID:
      process.env.INSTAGRAM_APP_ID ?? import.meta.env.INSTAGRAM_APP_ID,
    VERCEL_TOKEN: process.env.VERCEL_TOKEN ?? import.meta.env.VERCEL_TOKEN,
    VERCEL_PROJECT_ID:
      process.env.VERCEL_PROJECT_ID ?? import.meta.env.VERCEL_PROJECT_ID,
    VERCEL_TEAM_ID:
      process.env.VERCEL_TEAM_ID ?? import.meta.env.VERCEL_TEAM_ID,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
});
