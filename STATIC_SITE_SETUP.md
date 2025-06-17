# Static Site Instagram Setup (No Database Required)

This guide is specifically for static site deployments (Vercel, Netlify, GitHub Pages, etc.) where you don't have a database.

## How It Works

Instead of using a database, the system uses **environment variables** to store the long-lived Instagram token. The token automatically refreshes itself when needed.

## Step-by-Step Setup

### 1. Initial OAuth Setup (One-Time)

1. **Set up your basic environment variables:**
   ```env
   INSTAGRAM_APP_ID=your_app_id
   INSTAGRAM_APP_SECRET=your_app_secret
   INSTAGRAM_REDIRECT_URI=http://localhost:4321/instagram-callback
   ```

2. **Run the OAuth flow locally:**
   ```bash
   npm run dev
   # Visit http://localhost:4321/admin/instagram-setup
   # Click "Authorize Instagram Account"
   # Complete the OAuth flow
   ```

3. **Get your long-lived token:**
   - After successful OAuth, check your console logs
   - You'll see output like:
   ```
   📝 Instagram Token Received Successfully!
   🕐 Token expires at: 2025-08-17T10:30:00.000Z
   
   🔧 IMPORTANT: Add this to your environment variables:
   INSTAGRAM_LONG_LIVED_TOKEN=IGQVJXabc123def456...
   INSTAGRAM_TOKEN_EXPIRES_AT=1723885800000
   ```

4. **Add the token to your environment:**
   - Copy the `INSTAGRAM_LONG_LIVED_TOKEN` and `INSTAGRAM_TOKEN_EXPIRES_AT` values
   - Add them to your `.env` file for local development
   - Add them to your hosting platform's environment variables

### 2. Production Deployment

#### For Vercel:
1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add:
   ```
   INSTAGRAM_APP_ID=your_app_id
   INSTAGRAM_APP_SECRET=your_app_secret
   INSTAGRAM_REDIRECT_URI=https://yourdomain.com/instagram-callback
   INSTAGRAM_LONG_LIVED_TOKEN=IGQVJXabc123def456...
   INSTAGRAM_TOKEN_EXPIRES_AT=1723885800000
   ```
4. Redeploy your site

#### For Netlify:
1. Go to your Netlify site dashboard
2. Go to Site Settings → Environment Variables
3. Add the same variables as above
4. Redeploy your site

#### For Other Platforms:
Add the environment variables through your platform's interface and redeploy.

### 3. Automatic Token Refresh

The system automatically handles token refresh:

1. **Checks expiration:** Every time posts are fetched, it checks if the token expires within 7 days
2. **Refreshes automatically:** If expiring soon, it refreshes the token automatically
3. **Logs new token:** When refreshed, it logs the new token to the console
4. **Manual update:** You'll need to manually update the environment variable with the new token

## Token Refresh Process

When your token is about to expire (within 7 days), you'll see logs like:

```
🔄 Instagram token refreshed successfully
📝 New Token Information:
INSTAGRAM_LONG_LIVED_TOKEN=IGQVJXnew123token456...
INSTAGRAM_TOKEN_EXPIRES_AT=1731661800000

⚠️  Update your environment variables with the new token!
```

**Important:** You'll need to manually update your hosting platform's environment variables with the new token and redeploy.

## Monitoring Token Health

### Check Token Status
You can monitor your token in several ways:

1. **Application logs:** Check your hosting platform's function logs
2. **Manual check:** Visit `/admin/instagram-setup` to see the current auth status
3. **Posts loading:** If Instagram posts stop loading, check the token

### Setting Up Alerts (Optional)

For production monitoring, you can set up alerts:

1. **Vercel:** Use Vercel's monitoring and get notified of function errors
2. **Netlify:** Use Netlify's function logs and monitoring
3. **External monitoring:** Use services like UptimeRobot to monitor your Instagram feed

## Troubleshooting

### Posts Not Loading
1. Check your hosting platform's function logs
2. Verify environment variables are set correctly
3. Check if token has expired
4. Re-run OAuth flow if needed

### Token Expired
If your token expires and you miss the refresh:
1. Run the OAuth flow again locally
2. Get the new token from console logs
3. Update environment variables on your hosting platform
4. Redeploy

### Environment Variable Issues
- Make sure all required variables are set
- Check for typos in variable names
- Ensure variables are available at build time and runtime

## Maintenance Schedule

**Recommended:** Check your Instagram integration monthly
- Token refresh happens automatically every ~50 days
- Manual environment variable update needed after refresh
- Consider setting a calendar reminder to check logs

## Security Notes

- ✅ Environment variables are secure on hosting platforms
- ✅ Tokens are not exposed in client-side code
- ✅ Only your Instagram account data is accessed
- ✅ No user data is stored or processed

## Comparison: Static vs Database

| Feature | Static Site (Environment Variables) | Database Solution |
|---------|-------------------------------------|-------------------|
| **Setup Complexity** | ⭐ Simple | ⭐⭐⭐ Complex |
| **Maintenance** | ⭐⭐ Manual token updates | ⭐ Fully automatic |
| **Cost** | ⭐ Free | ⭐⭐ Database hosting costs |
| **Security** | ⭐⭐⭐ Platform-managed | ⭐⭐⭐ Self-managed |
| **Reliability** | ⭐⭐ Manual intervention needed | ⭐⭐⭐ Fully automatic |

For most static sites, the environment variable approach is perfect! 🎉
