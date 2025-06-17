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
    // Try to load existing token from storage (you might want to use a database in production)
    const storedToken = this.getStoredToken();
    if (storedToken) {
      this.tokenData = storedToken;
      
      // Check if token needs refresh
      if (this.isTokenExpiringSoon()) {
        await this.refreshAccessToken();
      }
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getValidAccessToken(): Promise<string> {
    if (!this.tokenData) {
      throw new Error("Instagram access token not initialized. Please complete the OAuth flow first.");
    }

    // Check if token is expiring soon (within 7 days)
    if (this.isTokenExpiringSoon()) {
      await this.refreshAccessToken();
    }

    return this.tokenData.access_token;
  }

  /**
   * Exchange authorization code for long-lived access token
   * This is used during the initial OAuth flow
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
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${shortTokenData.access_token}`
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
   * Refresh the long-lived access token
   */
  async refreshAccessToken(): Promise<void> {
    if (!this.tokenData) {
      throw new Error("No token data available to refresh");
    }

    try {
      const response = await fetch(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${this.tokenData.access_token}`
      );

      const data: InstagramTokenResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${data.error || 'Unknown error'}`);
      }

      // Update token data
      this.tokenData = {
        access_token: data.access_token,
        expires_at: data.expires_in ? Date.now() + (data.expires_in * 1000) : undefined,
      };

      this.storeToken(this.tokenData);
      console.log('Instagram access token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing access token:', error);
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
   * Store token data (in production, use a secure database)
   */
  private storeToken(tokenData: InstagramTokenData): void {
    try {
      if (typeof window === 'undefined') {
        // Server-side: store in a simple way for development
        // In production, use a proper database
        console.log('Instagram token received and should be stored securely.');
        console.log('Token expires at:', tokenData.expires_at ? new Date(tokenData.expires_at).toISOString() : 'No expiration');
        
        // For production, implement database storage here
        // Example: await db.tokens.upsert({ service: 'instagram', token: tokenData.access_token, expiresAt: tokenData.expires_at })
      }
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  /**
   * Retrieve stored token data
   */
  private getStoredToken(): InstagramTokenData | null {
    // For production, implement database retrieval here
    // Example: const token = await db.tokens.findFirst({ where: { service: 'instagram' } })
    // return token ? { access_token: token.token, expires_at: token.expiresAt } : null
    
    // For development, you can manually set a token here for testing
    // Once OAuth flow is completed, this should retrieve from your database
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
      scope: 'user_profile,user_media',
      response_type: 'code',
    });

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  }
}

export default InstagramAuthService;
