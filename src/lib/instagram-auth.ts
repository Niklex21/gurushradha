import type { InstagramTokenResponse, InstagramTokenData } from "@/types";

class InstagramAuthService {
  private static instance: InstagramAuthService;
  private tokenData: InstagramTokenData | null = null;

  private constructor() {}

  static getInstance(): InstagramAuthService {
    if (!InstagramAuthService.instance) {
      InstagramAuthService.instance = new InstagramAuthService();
    }
    return InstagramAuthService.instance;
  }

  /**
   * Initialize with existing token data or start fresh
   */
  async initialize() {
    // Try to load existing token from storage
    const storedToken = this.getStoredToken();
    if (storedToken) {
      this.tokenData = storedToken;
      
      // Check if token needs refresh (GitHub Actions handles this automatically)
      if (this.isTokenExpiringSoon()) {
        console.log('⚠️  Token expires soon. GitHub Actions will refresh it automatically.');
      }
    }
  }

  /**
   * Get a valid access token
   */
  async getValidAccessToken(): Promise<string> {
    if (!this.tokenData) {
      throw new Error("Instagram access token not initialized. Please complete the OAuth flow first.");
    }

    return this.tokenData.access_token;
  }

  /**
   * Exchange authorization code for long-lived access token
   */
  async exchangeCodeForToken(code: string): Promise<void> {
    const APP_ID = import.meta.env.INSTAGRAM_APP_ID;
    const APP_SECRET = import.meta.env.INSTAGRAM_APP_SECRET;
    const REDIRECT_URI = import.meta.env.INSTAGRAM_REDIRECT_URI;

    try {
      // Step 1: Get short-lived token
      const shortTokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: APP_ID,
          client_secret: APP_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URI,
          code: code,
        }),
      });

      const shortTokenData = await shortTokenResponse.json();
      
      if (!shortTokenResponse.ok) {
        throw new Error(`Failed to get short-lived token: ${shortTokenData.error_description || shortTokenData.error}`);
      }

      // Step 2: Exchange for long-lived token
      const longTokenResponse = await fetch(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${shortTokenData.data[0].access_token}`
      );

      const longTokenData: InstagramTokenResponse = await longTokenResponse.json();
      
      if (!longTokenResponse.ok) {
        throw new Error(`Failed to get long-lived token: ${longTokenData.error || 'Unknown error'}`);
      }

      // Store the long-lived token
      this.tokenData = {
        access_token: longTokenData.access_token,
        expires_at: longTokenData.expires_in ? Date.now() + (longTokenData.expires_in * 1000) : undefined,
      };

      this.storeToken(this.tokenData);
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  /**
   * Check if token is expiring within 7 days
   */
  private isTokenExpiringSoon(): boolean {
    if (!this.tokenData || !this.tokenData.expires_at) {
      return false;
    }

    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return this.tokenData.expires_at - Date.now() < sevenDaysInMs;
  }

  /**
   * Store token data (simple approach - GitHub Actions handles refresh)
   */
  private storeToken(tokenData: InstagramTokenData): void {
    try {
      console.log('📝 Instagram Token Received Successfully!');
      console.log('🕐 Token expires at:', tokenData.expires_at ? new Date(tokenData.expires_at).toISOString() : 'No expiration');
      console.log('');
      console.log('🔧 Add this to your environment variables:');
      console.log('INSTAGRAM_LONG_LIVED_TOKEN=' + tokenData.access_token);
      if (tokenData.expires_at) {
        console.log('INSTAGRAM_TOKEN_EXPIRES_AT=' + tokenData.expires_at);
      }
      console.log('');
      console.log('✅ GitHub Actions will automatically refresh this token every 30 days');
      console.log('🎉 No manual maintenance required!');
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  /**
   * Retrieve stored token data from environment variables
   */
  private getStoredToken(): InstagramTokenData | null {
    const storedToken = import.meta.env.INSTAGRAM_LONG_LIVED_TOKEN;
    const expiresAt = import.meta.env.INSTAGRAM_TOKEN_EXPIRES_AT;
    
    if (storedToken) {
      return {
        access_token: storedToken,
        expires_at: expiresAt ? parseInt(expiresAt) : undefined,
      };
    }
    
    return null;
  }

  /**
   * Generate OAuth URL for initial authorization
   */
  getAuthorizationUrl(): string {
    const APP_ID = import.meta.env.INSTAGRAM_APP_ID;
    const REDIRECT_URI = import.meta.env.INSTAGRAM_REDIRECT_URI;
    
    const params = new URLSearchParams({
      client_id: APP_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'instagram_business_basic',
      response_type: 'code',
    });

    return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
  }
}

export default InstagramAuthService;
