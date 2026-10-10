# Instagram feed operations

The public home page must remain useful when Instagram is unavailable. It displays a link to @gurushradha when the feed is empty or unavailable, and never displays provider errors.

## Renewal

Vercel invokes `/api/instagram-maintenance` daily at 03:17 UTC. The request must contain `Authorization: Bearer <CRON_SECRET>`; missing configuration fails closed. This replaces the GitHub Actions refresh workflow, which had no completed runs after June 2026 and two runner-less queued attempts in August.

The server reads the production `INSTAGRAM_ACCESS_KEY` through Vercel's authenticated API rather than relying on the value frozen into an old deployment. Every seven days it refreshes the token, validates the Instagram account ID, stores it encrypted in the same environment-variable record with its expiry, and reads it back to verify persistence. No redeployment is required. Normal production feed traffic can also perform an overdue renewal. Preview deployments cannot rotate production credentials.

The scheduler is daily even though renewal is weekly: missed invocations leave several weeks of margin before a normal 60-day token expires. Renewal failures are reported as HTTP 503 from the protected maintenance endpoint. That endpoint verifies actual media access every day, including days when renewal isn't due. Vercel cron logs show failures. There is no independent email/pager alert configured by this change.

Required existing Vercel project variables:

- `VERCEL_TOKEN`: a valid Vercel API credential with read/update access to this project's environment variables.
- `VERCEL_PROJECT_ID`: the `gs-website` project ID.
- `CRON_SECRET`: a nonempty secret also used by Vercel's cron invocation.
- `INSTAGRAM_ACCESS_KEY`: an encrypted long-lived Instagram user token. Keep its production record unique. It may retain its existing preview/development targets.
- `INSTAGRAM_APP_ID`: the Instagram **user/account ID** used by the media endpoint, despite the legacy variable name; not the Meta developer application's ID.
- `VERCEL_TEAM_ID`: optional, for a credential that requires an explicit team scope.

The production runtime needs `VERCEL_ENV=production` (Vercel's automatic system variable). Credential revocation, an expired Vercel credential, or an already-expired Instagram token still needs operator intervention. No implementation can renew a revoked/expired Instagram session without reconnecting the account.

## Recovery

1. In the Meta developer application's Instagram API setup, reconnect @gurushradha and obtain a **long-lived** token with the existing read permissions. Do not paste credentials into issues, PRs, chat, or logs.
2. Replace `INSTAGRAM_ACCESS_KEY` in the existing Vercel project environment-variable record. The new runtime reads that value within five minutes; a cold start reads it immediately. No redeploy is needed.
3. Call the protected maintenance endpoint with the existing cron secret. Verify HTTP 200, `healthy: true`, and the reported post count. A newly installed token isn't renewed until at least seven days after its environment-variable update.
4. Verify images/videos on the public home page. Verify the next Vercel scheduled invocation succeeds; a manual run proves the endpoint, not the scheduler.

The feed uses a five-minute cache and a one-minute failure backoff per warm instance. A recent warm feed survives brief outages; it is discarded after an hour because Instagram CDN media URLs also expire. This is not a durable media archive. Cold starts during an outage display the Instagram link.

## Validation

Run `npm test` for regression coverage of expiry, persistence, cold starts, missed schedules, preview isolation, concurrent visitors, malformed responses, outages, and cron authorization. Run `npm run build` for Astro type checks and a production build.
