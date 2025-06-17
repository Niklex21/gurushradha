# Meta App Configuration for Production

This guide will help you configure your Meta app for production deployment with the required privacy policy and terms of service.

> **Note**: This document covers Meta app configuration only. For Instagram API setup, see [SIMPLE_SETUP.md](./SIMPLE_SETUP.md) for the simplified approach.

## Prerequisites

✅ Privacy Policy page created at `/privacy-policy`
✅ Terms of Service page created at `/terms-of-service`
✅ Both pages accessible from your website footer

## Step 1: Complete App Review Preparation

### 1.1 App Information
1. Go to [Facebook Developers Console](https://developers.facebook.com/apps/)
2. Select your app → Settings → Basic
3. Fill out all required information:
   - **App Name**: Gurushradha Website
   - **App Category**: Business
   - **App Description**: "Website integration to display Instagram posts from our official account to keep visitors updated about our cultural activities and events."

### 1.2 App Purpose
In the app description, clearly state:
```
This app integrates with our website to display Instagram posts from our official Gurushradha Instagram account. 
The app only accesses our own Instagram business account data to show our latest posts, events, and activities 
on our website. No user data is collected or processed.
```

## Step 2: Configure Instagram Graph API Product

### 2.1 Product Settings
1. Go to Instagram Graph API → Settings
2. Add your production redirect URI:
   ```
   https://yourdomain.com/instagram-callback
   ```
3. Add your development redirect URI for testing:
   ```
   http://localhost:4321/instagram-callback
   ```

### 2.2 Permissions
Your app should only request the minimum permissions needed:
- ✅ `user_profile` - To access basic profile information of your business account
- ✅ `user_media` - To access media from your business account

## Step 3: Privacy Policy and Terms Requirements

### 3.1 Privacy Policy URL
1. Go to Settings → Basic
2. Add Privacy Policy URL:
   ```
   https://yourdomain.com/privacy-policy
   ```

### 3.2 Terms of Service URL
1. In the same section, add Terms of Service URL:
   ```
   https://yourdomain.com/terms-of-service
   ```

### 3.3 User Data Use Description
In the "User Data Use" section, describe:
```
This app does not collect or process any user data. It only accesses Instagram posts 
from our own business account (Gurushradha) to display them on our website. 
No visitor data is collected through this integration.
```

## Step 4: Business Verification (If Required)

For some apps, Meta may require business verification:

1. **Business Documents**: Have your business registration documents ready
2. **Website Domain**: Verify ownership of your domain
3. **Business Address**: Provide a valid business address
4. **Business Phone**: Provide a business phone number

## Step 5: App Review Submission

### 5.1 Pre-Submission Checklist
- ✅ Privacy Policy is live and accessible
- ✅ Terms of Service is live and accessible
- ✅ App description clearly explains the limited scope
- ✅ Only necessary permissions are requested
- ✅ Test the OAuth flow in development
- ✅ Instagram account is a Business/Creator account
- ✅ Instagram account is connected to a Facebook Page

### 5.2 Review Submission
1. Go to App Review → Permissions and Features
2. Request review for:
   - `user_profile`
   - `user_media`
3. For each permission, explain:
   ```
   This permission is used to access our own Instagram business account data 
   to display our posts on our website. No user accounts or data are accessed.
   ```

### 5.3 Provide Reviewer Instructions
```
To test this app:
1. Visit https://yourdomain.com/admin/instagram-setup
2. Click "Authorize Instagram Account"
3. Log in with the Gurushradha Instagram business account
4. Complete the authorization
5. Visit the homepage to see Instagram posts displayed
6. Note: Only our own Instagram posts are displayed, no user data is accessed
```

## Step 6: Go Live

### 6.1 Switch to Live Mode
1. Go to Settings → Basic
2. Toggle "App Mode" from Development to Live
3. Your app is now publicly available

### 6.2 Production Environment Variables
Update your production environment with:
```env
INSTAGRAM_APP_ID=your_production_app_id
INSTAGRAM_APP_SECRET=your_production_app_secret
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/instagram-callback
```

## Step 7: Post-Launch Monitoring

### 7.1 App Dashboard Monitoring
- Monitor API usage in the App Dashboard
- Check for any policy violations or warnings
- Monitor app performance and error rates

### 7.2 Token Health
- The app will automatically refresh tokens
- Monitor logs for any authentication issues
- Set up alerts for API failures

## Compliance Notes

### Data Use
- ✅ Only access your own Instagram account data
- ✅ Don't store user data
- ✅ Don't request unnecessary permissions
- ✅ Clearly explain data usage in privacy policy

### Platform Policies
- ✅ Follow Meta Platform Policy
- ✅ Follow Instagram Community Guidelines
- ✅ Follow Instagram API Terms of Use
- ✅ Maintain privacy policy and terms of service

## Troubleshooting

### Common Review Issues
1. **"App purpose unclear"**
   - Solution: Update app description to be more specific about only displaying your own posts

2. **"Privacy policy doesn't match app functionality"**
   - Solution: Ensure privacy policy specifically mentions Instagram integration and no user data collection

3. **"Permissions too broad"**
   - Solution: Only request `user_profile` and `user_media`, explain they're for your own account

### App Rejected?
If your app is rejected:
1. Read the rejection reason carefully
2. Update your app configuration based on feedback
3. Resubmit with clear explanations of changes made

## Support

If you encounter issues:
- Meta Developer Support: https://developers.facebook.com/support/
- Instagram Platform Documentation: https://developers.facebook.com/docs/instagram-platform/
- Check the detailed setup guide in `INSTAGRAM_SETUP.md`

---

**Important**: Replace all placeholder URLs (yourdomain.com) with your actual domain before submission!
