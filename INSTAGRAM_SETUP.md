# Instagram API Setup Guide

This guide will help you set up Instagram API integration that automatically handles token refresh without manual intervention.

## Overview

The new implementation uses the Instagram Graph API with OAuth 2.0 flow to create long-lived access tokens that automatically refresh every ~60 days.

## Step 1: Facebook/Meta Developer Console Setup

1. **Go to Facebook Developers Console**
   - Visit [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/)
   - Log in with your Facebook account

2. **Create or Select Your App**
   - If you don't have an app, click "Create App" → "Business" → "Next"
   - Give your app a name and contact email
   - If you already have an app, select it from the dashboard

3. **Add Instagram Graph API Product**
   - In your app dashboard, click "Add Product" 
   - Find "Instagram Graph API" and click "Set Up"

4. **Configure Instagram Graph API Settings**
   - Go to Instagram Graph API → Settings
   - Add your redirect URI: `https://yourdomain.com/instagram-callback`
   - For local development: `http://localhost:4321/instagram-callback`

5. **Get Your App Credentials**
   - Go to Settings → Basic
   - Copy your "App ID" and "App Secret"

6. **Set App Mode to Live**
   - Your app must be in "Live" mode (not Development mode)
   - Complete any required verification steps

## Step 2: Instagram Account Requirements

Your Instagram account must meet these requirements:
- Must be a **Business** or **Creator** account (not Personal)
- Must be connected to a Facebook Page
- Must have published content

To convert to Business/Creator:
1. Open Instagram app → Settings → Account → Switch to Professional Account
2. Choose Business or Creator
3. Connect to a Facebook Page

## Step 3: Environment Variables

Create/update your `.env` file with:

```env
INSTAGRAM_APP_ID=your_app_id_from_step_1
INSTAGRAM_APP_SECRET=your_app_secret_from_step_1
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/instagram-callback
```

For local development:
```env
INSTAGRAM_REDIRECT_URI=http://localhost:4321/instagram-callback
```

## Step 4: Complete OAuth Setup

1. **Start your development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

2. **Visit the setup page**
   - Go to `http://localhost:4321/admin/instagram-setup`

3. **Authorize your Instagram account**
   - Click the "Authorize Instagram Account" button
   - Log in to Instagram if prompted
   - Authorize the app to access your Instagram data
   - You'll be redirected back to your site with a success message

## Step 5: Test the Integration

1. **Check if posts are loading**
   - Visit any page with Instagram integration
   - Posts should load without errors

2. **Verify automatic refresh**
   - The system will automatically refresh tokens before they expire
   - No manual intervention needed

## Production Deployment

### Database Storage (Recommended)

For production, implement proper database storage for tokens:

```typescript
// Example with Prisma
private async storeToken(tokenData: InstagramTokenData): Promise<void> {
  await prisma.socialTokens.upsert({
    where: { platform: 'instagram' },
    update: {
      accessToken: tokenData.access_token,
      expiresAt: tokenData.expires_at ? new Date(tokenData.expires_at) : null,
    },
    create: {
      platform: 'instagram',
      accessToken: tokenData.access_token,
      expiresAt: tokenData.expires_at ? new Date(tokenData.expires_at) : null,
    },
  });
}
```

### Environment Variables for Production

Update your production environment with:
- `INSTAGRAM_APP_ID`
- `INSTAGRAM_APP_SECRET` 
- `INSTAGRAM_REDIRECT_URI` (your production domain)

### Security Considerations

1. **Secure your App Secret**: Never expose it in client-side code
2. **Use HTTPS**: Always use HTTPS in production for the redirect URI
3. **Database security**: Store tokens in an encrypted database
4. **Access control**: Restrict access to the `/admin/instagram-setup` page

## Privacy Policy and Terms of Service

✅ **Privacy Policy**: Available at `/privacy-policy`  
✅ **Terms of Service**: Available at `/terms-of-service`  
✅ **Footer Links**: Both pages are linked in the website footer  

These pages are required for Meta app approval and comply with Meta's Platform Policy requirements. They specifically address the Instagram integration and clarify that no user data is collected.

## Troubleshooting

### "Invalid redirect URI" error
- Make sure the redirect URI in Meta Console exactly matches your environment variable
- Include the protocol (http:// or https://)

### "Invalid client_secret" error
- Double-check your `INSTAGRAM_APP_SECRET` environment variable
- Make sure there are no extra spaces or characters

### "User is not authorized" error
- Make sure your Instagram account is Business/Creator
- Verify the account is connected to a Facebook Page
- Check that your app is in Live mode

### Posts not loading
- Check browser console for error messages
- Verify the OAuth flow completed successfully
- Check that your Instagram account has published posts

## Token Lifecycle

- **Initial Setup**: Manual OAuth flow (one time)
- **Daily Usage**: Automatic token validation
- **Token Refresh**: Automatic every ~50 days (7 days before expiration)
- **No Manual Intervention**: System handles everything automatically

Your Instagram integration is now maintenance-free! 🎉
