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
import { writeFileSync } from "fs";
import { join } from "path";

/**
 * Update Vercel environment variable in production
 */
async function updateVercelEnvironmentVariable(
  newToken: string,
): Promise<boolean> {
  const vercelToken = import.meta.env.VERCEL_TOKEN;
  const vercelProjectId = import.meta.env.VERCEL_PROJECT_ID;

  if (!vercelToken || !vercelProjectId) {
    console.warn(
      "VERCEL_TOKEN or VERCEL_PROJECT_ID not set, cannot auto-update Vercel environment variable",
    );
    return false;
  }

  try {
    // First, get existing environment variables to find the INSTAGRAM_ACCESS_KEY
    const getResponse = await fetch(
      `https://api.vercel.com/v9/projects/${vercelProjectId}/env`,
      {
        headers: {
          Authorization: `Bearer ${vercelToken}`,
        },
      },
    );

    if (!getResponse.ok) {
      throw new Error(
        `Failed to get environment variables: ${getResponse.statusText}`,
      );
    }

    const envVars = await getResponse.json();
    const existingVar = envVars.envs?.find(
      (env: any) => env.key === "INSTAGRAM_ACCESS_KEY",
    );

    if (existingVar) {
      // Update existing variable
      const updateResponse = await fetch(
        `https://api.vercel.com/v9/projects/${vercelProjectId}/env/${existingVar.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: newToken,
          }),
        },
      );

      if (updateResponse.ok) {
        console.log("✅ Successfully updated INSTAGRAM_ACCESS_KEY in Vercel");
        return true;
      } else {
        const error = await updateResponse.json();
        console.error(
          "❌ Failed to update Vercel environment variable:",
          error,
        );
        return false;
      }
    } else {
      console.warn(
        "INSTAGRAM_ACCESS_KEY not found in Vercel environment variables",
      );
      return false;
    }
  } catch (error) {
    console.error("Error updating Vercel environment variable:", error);
    return false;
  }
}

/**
 * Update local .env file in development
 */
function updateLocalEnvironment(newToken: string): boolean {
  try {
    const envPath = join(process.cwd(), ".env");

    // Read existing .env file
    let envContent = "";
    try {
      envContent = require("fs").readFileSync(envPath, "utf8");
    } catch {
      // .env file doesn't exist, create it
      console.log("Creating new .env file...");
    }

    // Update or add INSTAGRAM_ACCESS_KEY
    const lines = envContent.split("\n");
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("INSTAGRAM_ACCESS_KEY=")) {
        lines[i] = `INSTAGRAM_ACCESS_KEY=${newToken}`;
        updated = true;
        break;
      }
    }

    if (!updated) {
      lines.push(`INSTAGRAM_ACCESS_KEY=${newToken}`);
    }

    // Write back to file
    writeFileSync(envPath, lines.join("\n"));
    console.log(
      "✅ Successfully updated INSTAGRAM_ACCESS_KEY in local .env file",
    );
    return true;
  } catch (error) {
    console.error("Error updating local .env file:", error);
    return false;
  }
}

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

      // Update environment variables based on environment
      const isProduction = import.meta.env.PROD;
      let envUpdateSuccess = false;

      if (isProduction) {
        // Update Vercel environment variable in production
        envUpdateSuccess = await updateVercelEnvironmentVariable(newToken);
      } else {
        // Update local .env file in development
        envUpdateSuccess = updateLocalEnvironment(newToken);
      }

      // Get token info for logging
      const tokenInfo = await tokenManager.getTokenInfo();
      const expiryDays = Math.floor(tokenInfo.expires_in / (24 * 60 * 60));

      console.log("✅ Token refreshed successfully");
      if (envUpdateSuccess) {
        console.log("✅ Environment variable updated successfully");
      } else {
        console.warn(
          "⚠️ Failed to update environment variable - you may need to update manually",
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Instagram token refreshed successfully",
          tokenRefreshed: true,
          environmentUpdated: envUpdateSuccess,
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
