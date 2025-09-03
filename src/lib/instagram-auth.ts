/**
 * Instagram Graph API token management utilities
 * Handles automatic token refresh for long-lived access tokens
 */

export interface TokenInfo {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface LongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // seconds until expiration
}

export class InstagramTokenManager {
  private appId: string;
  private appSecret: string;
  private currentToken: string;

  constructor(appId: string, appSecret: string, currentToken: string) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.currentToken = currentToken;
  }

  /**
   * Refresh a long-lived access token
   * Long-lived tokens are valid for 60 days and can be refreshed before expiry
   */
  async refreshLongLivedToken(): Promise<LongLivedTokenResponse> {
    const url = new URL("https://graph.instagram.com/refresh_access_token");
    url.searchParams.append("grant_type", "ig_refresh_token");
    url.searchParams.append("access_token", this.currentToken);

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to refresh token: ${error.error?.message || "Unknown error"}`,
      );
    }

    return response.json();
  }

  /**
   * Get token info including expiration time
   * Note: This endpoint provides debug info about the token
   */
  async getTokenInfo(): Promise<TokenInfo> {
    const url = new URL("https://graph.instagram.com/me");
    url.searchParams.append("fields", "id");
    url.searchParams.append("access_token", this.currentToken);

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to get token info: ${error.error?.message || "Unknown error"}`,
      );
    }

    // Since Instagram doesn't provide expiry info directly, we'll use a different approach
    // We'll try to refresh and see the response
    const debugUrl = new URL("https://graph.facebook.com/debug_token");
    debugUrl.searchParams.append("input_token", this.currentToken);
    debugUrl.searchParams.append(
      "access_token",
      `${this.appId}|${this.appSecret}`,
    );

    const debugResponse = await fetch(debugUrl.toString());
    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      return {
        access_token: this.currentToken,
        expires_in: debugData.data?.expires_at
          ? debugData.data.expires_at - Math.floor(Date.now() / 1000)
          : 60 * 24 * 60 * 60, // default to 60 days
        token_type: "bearer",
      };
    }

    // Fallback: assume token is fresh (60 days)
    return {
      access_token: this.currentToken,
      expires_in: 60 * 24 * 60 * 60, // 60 days in seconds
      token_type: "bearer",
    };
  }

  /**
   * Check if token needs refresh (refresh every 30 days to be safe)
   * Since we can't easily check exact expiry, we'll use a conservative approach
   */
  async shouldRefreshToken(): Promise<boolean> {
    try {
      // Try to make a simple API call to check if token is valid
      const testUrl = new URL("https://graph.instagram.com/me");
      testUrl.searchParams.append("fields", "id");
      testUrl.searchParams.append("access_token", this.currentToken);

      const response = await fetch(testUrl.toString());

      if (!response.ok) {
        console.log("Token validation failed, refresh needed");
        return true;
      }

      // For safety, we'll refresh tokens every 30 days instead of waiting for expiry
      // You can implement more sophisticated date tracking if needed
      const lastRefreshDate = process.env.INSTAGRAM_TOKEN_LAST_REFRESH;
      if (lastRefreshDate) {
        const daysSinceRefresh =
          (Date.now() - parseInt(lastRefreshDate)) / (1000 * 60 * 60 * 24);
        if (daysSinceRefresh >= 30) {
          console.log(
            `Token is ${Math.floor(daysSinceRefresh)} days old, refresh needed`,
          );
          return true;
        }
      } else {
        // No last refresh date, assume we should refresh
        console.log("No last refresh date found, refresh needed");
        return true;
      }

      return false;
    } catch (error) {
      console.warn(
        "Could not check token validity, assuming refresh needed:",
        error,
      );
      return true;
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getValidToken(): Promise<string> {
    const needsRefresh = await this.shouldRefreshToken();

    if (needsRefresh) {
      console.log("Instagram token needs refresh, refreshing...");
      const refreshedToken = await this.refreshLongLivedToken();

      // Update the current token
      this.currentToken = refreshedToken.access_token;

      console.log("✅ Token refreshed successfully");
      console.log(
        "⚠️ Note: You may need to update INSTAGRAM_ACCESS_KEY in Vercel manually with the new token",
      );

      return refreshedToken.access_token;
    }

    return this.currentToken;
  }

  /**
   * Refresh token and return the new token (for manual use)
   */
  async refreshAndGetNewToken(): Promise<string> {
    console.log("🔄 Refreshing Instagram token...");
    const refreshedToken = await this.refreshLongLivedToken();

    this.currentToken = refreshedToken.access_token;
    console.log("✅ Token refreshed successfully");

    return refreshedToken.access_token;
  }
}
