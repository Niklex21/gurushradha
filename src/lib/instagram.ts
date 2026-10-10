import type { InstagramPost } from "../types";

const DAY = 86_400_000;
const REFRESH_INTERVAL = 7 * DAY;
const CACHE_TTL = 5 * 60_000;
const GRAPH = "https://graph.instagram.com/v21.0/";
interface TokenRecord {
  id?: string;
  token: string;
  updatedAt: number;
  expiresAt?: number;
  target?: string[];
}
type Environment = Record<string, string | undefined>;
export class InstagramError extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

// Durable state lives in Vercel's encrypted project env, never only in memory.
export function createInstagramService({
  env,
  fetcher = fetch,
  now = Date.now,
  report = (code: string) => console.error(`[Instagram] ${code}`),
}: {
  env: Environment;
  fetcher?: typeof fetch;
  now?: () => number;
  report?: (code: string) => void;
}) {
  let record: TokenRecord | undefined;
  let tokenReadAt = 0;
  let posts: InstagramPost[] = [];
  let feedReadAt = 0;
  let retryAt = 0;
  let feedPending:
    | Promise<{ posts: InstagramPost[]; unavailable: boolean }>
    | undefined;
  let renewalPending: Promise<TokenRecord> | undefined;

  async function json(url: URL | string, init?: RequestInit): Promise<any> {
    let response: Response;
    let payload: any;
    try {
      response = await fetcher(url, {
        ...init,
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      payload = await response.json();
    } catch {
      throw new InstagramError("upstream_unavailable");
    }
    if (!response.ok || payload.error) {
      // Provider messages and URLs can contain secrets. Return only safe codes.
      throw new InstagramError(
        payload.error?.code === 190
          ? "reconnect_required"
          : "upstream_unavailable",
      );
    }
    return payload;
  }
  function vercelUrl(path: string) {
    const url = new URL(path, "https://api.vercel.com");
    if (env.VERCEL_TEAM_ID) url.searchParams.set("teamId", env.VERCEL_TEAM_ID);
    return url;
  }
  const vercelHeaders = () => ({
    Authorization: `Bearer ${env.VERCEL_TOKEN}`,
    "Content-Type": "application/json",
  });

  async function readToken(force = false): Promise<TokenRecord> {
    if (!force && record && now() - tokenReadAt < CACHE_TTL) return record;
    if (!env.VERCEL_TOKEN || !env.VERCEL_PROJECT_ID) {
      if (env.VERCEL_ENV)
        throw new InstagramError("token_store_not_configured");
      if (!env.INSTAGRAM_ACCESS_KEY)
        throw new InstagramError("token_not_configured");
      return { token: env.INSTAGRAM_ACCESS_KEY, updatedAt: now() };
    }
    const project = encodeURIComponent(env.VERCEL_PROJECT_ID);
    const listing = await json(vercelUrl(`/v10/projects/${project}/env`), {
      headers: vercelHeaders(),
    });
    const matches = listing.envs?.filter(
      (item: any) =>
        item.key === "INSTAGRAM_ACCESS_KEY" &&
        item.target?.includes("production") &&
        !item.gitBranch,
    );
    if (matches?.length !== 1)
      throw new InstagramError("token_store_ambiguous");
    const item = matches[0];
    const decrypted = await json(
      vercelUrl(`/v1/projects/${project}/env/${encodeURIComponent(item.id)}`),
      { headers: vercelHeaders() },
    );
    if (!decrypted.value || typeof decrypted.value !== "string")
      throw new InstagramError("token_store_unreadable");
    let expiresAt: number | undefined;
    try {
      const metadata = JSON.parse(item.comment);
      if (
        metadata.source === "instagram-renewal" &&
        Number.isFinite(metadata.expiresAt)
      )
        expiresAt = metadata.expiresAt;
    } catch {
      /* Legacy manually supplied tokens have no structured metadata. */
    }
    record = {
      id: item.id,
      token: decrypted.value,
      updatedAt: Number(item.updatedAt) || 0,
      expiresAt,
      target: item.target,
    };
    tokenReadAt = now();
    return record;
  }
  async function graph(
    path: string,
    token: string,
    fields: string,
    limit?: number,
  ) {
    const url = new URL(path, GRAPH);
    url.searchParams.set("access_token", token);
    url.searchParams.set("fields", fields);
    if (limit) url.searchParams.set("limit", String(limit));
    return json(url);
  }
  async function renew(current: TokenRecord): Promise<TokenRecord> {
    // Previews must never rotate the production credential.
    if (
      env.VERCEL_ENV !== "production" ||
      now() - current.updatedAt < REFRESH_INTERVAL
    )
      return current;
    if (renewalPending) return renewalPending;
    renewalPending = (async () => {
      if (!current.id) throw new InstagramError("token_store_not_configured");
      const url = new URL("https://graph.instagram.com/refresh_access_token");
      url.searchParams.set("grant_type", "ig_refresh_token");
      url.searchParams.set("access_token", current.token);
      const refreshed = await json(url);
      if (
        typeof refreshed.access_token !== "string" ||
        !refreshed.access_token ||
        !Number.isFinite(refreshed.expires_in) ||
        refreshed.expires_in < (30 * DAY) / 1000
      ) {
        throw new InstagramError("invalid_refresh_response");
      }
      const identity = await graph("me", refreshed.access_token, "id");
      if (identity.id !== env.INSTAGRAM_APP_ID)
        throw new InstagramError("account_mismatch");
      const updatedAt = now();
      const expiresAt = updatedAt + refreshed.expires_in * 1000;
      await json(
        vercelUrl(
          `/v9/projects/${encodeURIComponent(env.VERCEL_PROJECT_ID!)}/env/${encodeURIComponent(current.id)}`,
        ),
        {
          method: "PATCH",
          headers: vercelHeaders(),
          body: JSON.stringify({
            value: refreshed.access_token,
            type: "encrypted",
            target: current.target,
            comment: JSON.stringify({
              source: "instagram-renewal",
              refreshedAt: updatedAt,
              expiresAt,
            }),
          }),
        },
      );
      // Confirm durable persistence before reporting success.
      const saved = await readToken(true);
      if (
        saved.token !== refreshed.access_token ||
        saved.expiresAt !== expiresAt
      )
        throw new InstagramError("token_save_not_verified");
      return saved;
    })();
    try {
      return await renewalPending;
    } finally {
      renewalPending = undefined;
    }
  }
  async function fetchPosts(token: string): Promise<InstagramPost[]> {
    if (!env.INSTAGRAM_APP_ID)
      throw new InstagramError("account_not_configured");
    const payload = await graph(
      `${encodeURIComponent(env.INSTAGRAM_APP_ID)}/media`,
      token,
      "id,permalink,caption,media_url,media_type,thumbnail_url,children{id,media_type,media_url,thumbnail_url}",
      25,
    );
    if (!Array.isArray(payload.data))
      throw new InstagramError("invalid_feed_response");
    return payload.data
      .filter(
        (post: any) =>
          post.id &&
          post.permalink &&
          post.media_url &&
          ["IMAGE", "VIDEO", "CAROUSEL_ALBUM"].includes(post.media_type),
      )
      .map((post: any) => ({
        id: post.id,
        permalink: post.permalink,
        caption: post.caption ?? "",
        media_url: post.media_url,
        media_type: post.media_type,
        thumbnail_url: post.thumbnail_url,
        children: post.children?.data?.filter(
          (child: any) =>
            child.id &&
            child.media_url &&
            ["IMAGE", "VIDEO"].includes(child.media_type),
        ),
      }));
  }
  async function getFeed() {
    if (now() < retryAt || (feedReadAt && now() - feedReadAt < CACHE_TTL))
      return { posts, unavailable: posts.length === 0 };
    if (feedPending) return feedPending;
    feedPending = (async () => {
      try {
        let current: TokenRecord;
        try {
          current = await readToken();
        } catch (error) {
          if (!record || (record.expiresAt && record.expiresAt <= now()))
            throw error;
          current = record;
          report("token_store_temporarily_unavailable");
        }
        // Traffic supplies a second chance to renew if a scheduled invocation is missed.
        try {
          current = await renew(current);
        } catch (error) {
          report(
            error instanceof InstagramError ? error.code : "renewal_failed",
          );
        }
        posts = await fetchPosts(current.token);
        feedReadAt = now();
        retryAt = 0;
      } catch (error) {
        report(error instanceof InstagramError ? error.code : "feed_failed");
        retryAt = now() + 60_000;
        // Instagram media URLs expire: don't serve an indefinitely stale cache.
        if (now() - feedReadAt > 60 * 60_000) posts = [];
      }
      return { posts, unavailable: posts.length === 0 };
    })();
    try {
      return await feedPending;
    } finally {
      feedPending = undefined;
    }
  }
  async function maintain() {
    if (env.VERCEL_ENV !== "production")
      throw new InstagramError("production_only");
    const current = await renew(await readToken(true));
    // Check real feed access even on days when renewal isn't due.
    posts = await fetchPosts(current.token);
    feedReadAt = now();
    retryAt = 0;
    return {
      healthy: true,
      checkedAt: new Date(now()).toISOString(),
      refreshedAt: new Date(current.updatedAt).toISOString(),
      expiresAt: current.expiresAt
        ? new Date(current.expiresAt).toISOString()
        : null,
      posts: posts.length,
    };
  }
  return { getFeed, maintain };
}
export function isCronAuthorized(request: Request, secret: string | undefined) {
  return (
    !!secret && request.headers.get("authorization") === `Bearer ${secret}`
  );
}
