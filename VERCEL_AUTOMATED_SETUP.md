# Vercel Automated Instagram Setup (Zero Maintenance)

This guide shows you how to set up **completely automated** Instagram token management on Vercel. Once configured, your Instagram integration will refresh tokens and redeploy automatically with **zero manual intervention**.

## 🎯 What This Achieves

- ✅ **Zero Manual Token Updates**: Tokens refresh and update automatically every ~50 days
- ✅ **Automatic Redeployment**: New deployments trigger automatically when tokens refresh
- ✅ **Zero Downtime**: Seamless token updates with no site interruptions
- ✅ **Production Ready**: Secure, encrypted environment variable management

## 📋 Prerequisites

1. Vercel account with a deployed project
2. Meta/Facebook Developer account with Instagram Graph API app
3. Instagram Business/Creator account connected to a Facebook Page

## 🚀 Step-by-Step Setup

### Step 1: Get Your Vercel API Credentials

1. **Get Vercel Access Token:**
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Click "Create Token"
   - Name it "Instagram Auto-Update Token"
   - Copy the token (starts with `vercel_`)

2. **Get Your Project ID:**
   - Go to your Vercel project dashboard
   - Go to Settings → General
   - Copy your "Project ID" (looks like `prj_abc123def456`)

### Step 2: Configure Environment Variables

Add these environment variables to your Vercel project:

1. **Go to your Vercel project → Settings → Environment Variables**

2. **Add Instagram API variables:**
   ```
   INSTAGRAM_APP_ID=your_meta_app_id
   INSTAGRAM_APP_SECRET=your_meta_app_secret
   INSTAGRAM_REDIRECT_URI=https://yourdomain.com/instagram-callback
   ```

3. **Add Vercel automation variables:**
   ```
   VERCEL_ACCESS_TOKEN=vercel_your_access_token_here
   VERCEL_PROJECT_ID=prj_your_project_id_here
   ```

4. **Set all variables for all environments:**
   - Target: Production, Preview, Development
   - Type: Encrypted (for secrets)

### Step 3: Initial OAuth Setup

1. **Deploy your site** with the environment variables
2. **Visit your setup page**: `https://yourdomain.com/admin/instagram-setup`
3. **Click "Authorize Instagram Account"**
4. **Complete the OAuth flow**

You'll see output like:
```
📝 Instagram Token Received Successfully!
🚀 Detected deployment platform: vercel
🔄 Updating Vercel environment variables...
✅ Vercel environment variables updated successfully!
🔄 Triggering deployment...
🚀 New deployment triggered automatically!
🎉 Your Instagram integration is now fully automated!
```

### Step 4: Verify Automation Works

1. **Check Vercel Dashboard:**
   - Go to your project → Deployments
   - You should see a new deployment triggered automatically
   - This deployment will use the updated Instagram token

2. **Check Environment Variables:**
   - Go to Settings → Environment Variables
   - You should see `INSTAGRAM_LONG_LIVED_TOKEN` and `INSTAGRAM_TOKEN_EXPIRES_AT` automatically updated

3. **Test Instagram Posts:**
   - Visit your site and check that Instagram posts are loading
   - The integration is now fully automated!

## 🔄 How Automatic Refresh Works

### Timeline:
- **Day 1**: Initial OAuth setup completes
- **Day 53**: Token expires in 7 days, automatic refresh triggers
- **Day 53**: New token updates Vercel environment variables automatically
- **Day 53**: New deployment triggers automatically with updated token
- **Day 113**: Process repeats automatically (every ~60 days)

### What Happens During Auto-Refresh:
1. **Detection**: System detects token expiring within 7 days
2. **Refresh**: Calls Instagram API to refresh token
3. **Update**: Updates Vercel environment variables via API
4. **Deploy**: Triggers new Vercel deployment automatically
5. **Complete**: Site continues working with new token

## 🛠️ Troubleshooting

### "Missing VERCEL_ACCESS_TOKEN" Error
**Cause**: Vercel API credentials not configured
**Solution**: 
1. Create access token at https://vercel.com/account/tokens
2. Add `VERCEL_ACCESS_TOKEN` to environment variables
3. Redeploy

### "Failed to update Vercel environment variables"
**Cause**: Invalid project ID or access token
**Solution**:
1. Verify your `VERCEL_PROJECT_ID` is correct
2. Check that your access token has the right permissions
3. Try regenerating the access token

### Manual Fallback Still Works
If automation fails, you'll see manual instructions in the logs:
```
❌ Failed to automatically update environment variables
🔧 MANUAL UPDATE REQUIRED:
Add these to your deployment platform environment variables:
INSTAGRAM_LONG_LIVED_TOKEN=IGQVJXabc123...
```

## 🔒 Security Notes

- ✅ **Vercel Access Token**: Only has access to your specific project
- ✅ **Instagram Token**: Encrypted in Vercel environment variables
- ✅ **API Calls**: All requests use HTTPS with proper authentication
- ✅ **No Client Exposure**: Tokens never exposed to client-side code

## 📊 Monitoring & Maintenance

### Zero Maintenance Required! 
Once set up, the system is fully automated. However, you can monitor:

### Vercel Function Logs:
- Go to your Vercel project → Functions
- Check logs for Instagram-related function calls
- Look for "Instagram token refreshed successfully" messages

### Set Up Alerts (Optional):
- Use Vercel's monitoring features
- Set up alerts for function failures
- Monitor your Instagram feed endpoint

### Backup Plan:
If automation ever fails, you can always:
1. Run the OAuth flow again manually
2. Use the manual token update instructions from logs

## 🎉 Benefits Summary

| Feature | Before | After |
|---------|--------|--------|
| **Token Updates** | Manual every 60 days | Automatic |
| **Deployments** | Manual after token update | Automatic |
| **Maintenance** | Regular intervention needed | Zero maintenance |
| **Downtime Risk** | High (if you forget) | Zero |
| **Developer Time** | Hours every 2 months | Zero |

## 💡 Pro Tips

1. **Test First**: Run OAuth setup on a preview deployment first
2. **Monitor Initially**: Check the first automatic refresh works (in ~50 days)
3. **Keep Credentials Safe**: Store Vercel access token securely
4. **Document Setup**: Keep record of when you set this up for team members

---

**🎊 Congratulations!** Your Instagram integration is now **completely automated**. No more manual token updates, no more deployments, no more maintenance. Just set it and forget it! 

The system will automatically handle everything for you, forever. ⚡
