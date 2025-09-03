/**
 * Vercel Cron Job Endpoint for Instagram Token Refresh
 *
 * This endpoint can be called by Vercel Cron Jobs to automatically refresh
 * Instagram access tokens before they expire.
 *
 * Usage:
 *   - Set up as a Vercel Cron Job to run weekly
 *   - Can also be called manually for testing: GET /api/refresh-instagram-token
 */

import type { APIRoute } from "astro";
import { InstagramTokenManager } from "../../lib/instagram-auth";

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get environment variables
    const INSTAGRAM_ACCESS_KEY = import.meta.env.INSTAGRAM_ACCESS_KEY;
    const INSTAGRAM_APP_ID = import.meta.env.INSTAGRAM_APP_ID;
    const INSTAGRAM_APP_SECRET = import.meta.env.INSTAGRAM_APP_SECRET;

    // Validate required environment variables
    if (!INSTAGRAM_ACCESS_KEY || !INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) {
      return new Response(
        JSON.stringify({
          error: "Missing required environment variables",
          missing: {
            INSTAGRAM_ACCESS_KEY: !INSTAGRAM_ACCESS_KEY,
            INSTAGRAM_APP_ID: !INSTAGRAM_APP_ID,
            INSTAGRAM_APP_SECRET: !INSTAGRAM_APP_SECRET,
          },
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    console.log("🔄 Starting Instagram token refresh via cron job...");

    // Initialize token manager
    const tokenManager = new InstagramTokenManager(
      INSTAGRAM_APP_ID,
      INSTAGRAM_APP_SECRET,
      INSTAGRAM_ACCESS_KEY,
    );

    // Check if token needs refresh
    const needsRefresh = await tokenManager.shouldRefreshToken();

    if (needsRefresh) {
      console.log("Token needs refresh, refreshing now...");

      // Refresh the token
      const newToken = await tokenManager.getValidToken();

      // Get token info for logging
      const tokenInfo = await tokenManager.getTokenInfo();
      const expiryDays = Math.floor(tokenInfo.expires_in / (24 * 60 * 60));

      console.log("✅ Token refreshed successfully");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Instagram token refreshed successfully",
          tokenRefreshed: true,
          expiresInDays: expiryDays,
          timestamp: new Date().toISOString(),
          // Don't return the actual token for security
          newTokenLength: newToken.length,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      console.log("Token is still valid, no refresh needed");

      // Get current token info
      const tokenInfo = await tokenManager.getTokenInfo();
      const expiryDays = Math.floor(tokenInfo.expires_in / (24 * 60 * 60));

      return new Response(
        JSON.stringify({
          success: true,
          message: "Instagram token is still valid",
          tokenRefreshed: false,
          expiresInDays: expiryDays,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (error) {
    console.error("❌ Instagram token refresh failed:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
