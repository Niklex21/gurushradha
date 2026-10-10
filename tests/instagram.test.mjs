import test from "node:test";
import assert from "node:assert/strict";
import {
  createInstagramService,
  isCronAuthorized,
} from "../src/lib/instagram.ts";
const DAY = 86400000;
const initialTime = Date.UTC(2026, 9, 10);
const photo = {
  id: "post",
  permalink: "https://www.instagram.com/p/example/",
  media_url: "https://example.com/photo.jpg",
  media_type: "IMAGE",
};
function fixture(options = {}) {
  let time = initialTime;
  let token = "stored-token";
  let updatedAt = time - (options.ageDays ?? 8) * DAY;
  let comment = "";
  const calls = [],
    reports = [];
  let failFeed = false,
    failStore = false;
  const env = {
    VERCEL_ENV: "production",
    VERCEL_PROJECT_ID: "project",
    VERCEL_TOKEN: "vercel-secret",
    INSTAGRAM_APP_ID: "account",
    INSTAGRAM_ACCESS_KEY: "old-deployment-token",
    ...options.env,
  };
  const fetcher = async (input, init = {}) => {
    const url = new URL(input);
    calls.push({ url, init });
    const reply = (data, status = 200) =>
      new Response(JSON.stringify(data), { status });
    if (url.hostname === "api.vercel.com") {
      assert.equal(init.headers.Authorization, "Bearer vercel-secret");
      if (failStore) return reply({ error: {} }, 503);
      if (init.method === "PATCH") {
        if (options.saveFails) return reply({ error: {} }, 500);
        const body = JSON.parse(init.body);
        assert.equal(body.type, "encrypted");
        assert.deepEqual(body.target, ["production", "preview", "development"]);
        if (!options.ignoreSave) {
          token = body.value;
          comment = body.comment;
          updatedAt = time;
        }
        return reply({ id: "env-id" });
      }
      if (url.pathname.startsWith("/v10/")) {
        return reply({
          envs: [
            {
              id: "preview-id",
              key: "INSTAGRAM_ACCESS_KEY",
              target: ["preview"],
            },
            {
              id: "env-id",
              key: "INSTAGRAM_ACCESS_KEY",
              target: ["production", "preview", "development"],
              updatedAt,
              comment,
            },
            ...(options.ambiguous
              ? [
                  {
                    id: "second",
                    key: "INSTAGRAM_ACCESS_KEY",
                    target: ["production"],
                  },
                ]
              : []),
          ],
        });
      }
      assert.match(url.pathname, /env\/env-id$/);
      return reply({ value: token });
    }
    if (url.pathname === "/refresh_access_token") {
      if (options.expired)
        return reply(
          { error: { code: 190, message: "secret provider error" } },
          400,
        );
      return reply({
        access_token: "new-token",
        expires_in: options.badLifetime ? 3600 : (60 * DAY) / 1000,
      });
    }
    if (url.pathname.endsWith("/me"))
      return reply({ id: options.wrongAccount ? "other-account" : "account" });
    if (url.pathname.endsWith("/media")) {
      if (options.expired || failFeed)
        return reply(
          { error: { code: 190, message: "secret provider error" } },
          400,
        );
      return reply(
        options.malformed ? { data: {} } : { data: options.posts ?? [photo] },
      );
    }
    throw new Error(`Unexpected path ${url.pathname}`);
  };
  const service = () =>
    createInstagramService({
      env,
      fetcher,
      now: () => time,
      report: (code) => reports.push(code),
    });
  return {
    service,
    calls,
    reports,
    advance: (n) => {
      time += n;
    },
    failFeed: () => {
      failFeed = true;
    },
    failStore: () => {
      failStore = true;
    },
  };
}
test("renewal persists encrypted token and a cold start uses it without a redeploy", async () => {
  const f = fixture();
  const result = await f.service().maintain();
  assert.equal(result.healthy, true);
  assert.equal(result.posts, 1);
  assert.equal(
    result.expiresAt,
    new Date(initialTime + 60 * DAY).toISOString(),
  );
  assert.equal(f.calls.filter((x) => x.init.method === "PATCH").length, 1);
  const feed = await f.service().getFeed();
  assert.equal(feed.posts[0].caption, "");
  assert.equal(
    f.calls.at(-1).url.searchParams.get("access_token"),
    "new-token",
  );
  assert.equal(
    f.calls.filter((x) => x.url.pathname === "/refresh_access_token").length,
    1,
  );
});
test("a recent token is checked daily without refreshing before it is due", async () => {
  const f = fixture({ ageDays: 1 });
  await f.service().maintain();
  assert.equal(
    f.calls.filter((x) => x.url.pathname === "/refresh_access_token").length,
    0,
  );
});
test("traffic renews an overdue token if the cron was missed; simultaneous visitors share one fetch", async () => {
  const f = fixture(),
    s = f.service();
  await Promise.all(Array.from({ length: 10 }, () => s.getFeed()));
  assert.equal(f.calls.filter((x) => x.init.method === "PATCH").length, 1);
  assert.equal(
    f.calls.filter((x) => x.url.pathname.endsWith("/media")).length,
    1,
  );
});
test("preview reads the stored credential but cannot renew or run maintenance", async () => {
  const f = fixture({ env: { VERCEL_ENV: "preview" } }),
    s = f.service();
  assert.equal((await s.getFeed()).posts.length, 1);
  assert.equal(f.calls.filter((x) => x.init.method === "PATCH").length, 0);
  await assert.rejects(s.maintain(), { code: "production_only" });
});
test("an expired credential gives a safe empty feed and maintenance fails explicitly", async () => {
  const f = fixture({ expired: true }),
    s = f.service();
  assert.deepEqual(await s.getFeed(), { posts: [], unavailable: true });
  assert.equal(f.reports.includes("reconnect_required"), true);
  assert.equal(
    JSON.stringify(f.reports).includes("secret provider error"),
    false,
  );
  const count = f.calls.length;
  await s.getFeed();
  assert.equal(f.calls.length, count);
  await assert.rejects(s.maintain(), { code: "reconnect_required" });
});
test("a failed persistent save is never reported as healthy renewal", async () => {
  const f = fixture({ saveFails: true });
  await assert.rejects(f.service().maintain(), {
    code: "upstream_unavailable",
  });
});
test("successful PATCH with unchanged storage is caught by read-back verification", async () => {
  const f = fixture({ ignoreSave: true });
  await assert.rejects(f.service().maintain(), {
    code: "token_save_not_verified",
  });
});
test("short-lived refresh responses and wrong accounts never overwrite production token", async () => {
  for (const options of [{ badLifetime: true }, { wrongAccount: true }]) {
    const f = fixture(options);
    await assert.rejects(f.service().maintain());
    assert.equal(f.calls.filter((x) => x.init.method === "PATCH").length, 0);
  }
});
test("ambiguous production token records fail closed", async () => {
  const f = fixture({ ambiguous: true });
  await assert.rejects(f.service().maintain(), {
    code: "token_store_ambiguous",
  });
});
test("a short outage uses a recent warm feed, but not media URLs older than an hour", async () => {
  const f = fixture({ ageDays: 1 }),
    s = f.service();
  await s.getFeed();
  f.advance(6 * 60000);
  f.failFeed();
  assert.equal((await s.getFeed()).posts.length, 1);
  f.advance(61 * 60000);
  assert.deepEqual(await s.getFeed(), { posts: [], unavailable: true });
});
test("a temporary token-store outage can use a known warm token", async () => {
  const f = fixture({ ageDays: 1 }),
    s = f.service();
  await s.getFeed();
  f.advance(6 * 60000);
  f.failStore();
  assert.equal((await s.getFeed()).posts.length, 1);
  assert.ok(f.reports.includes("token_store_temporarily_unavailable"));
});
test("malformed feed responses fall back instead of crashing the home page", async () => {
  const f = fixture({ ageDays: 1, malformed: true });
  assert.deepEqual(await f.service().getFeed(), {
    posts: [],
    unavailable: true,
  });
});
test("carousel children are expanded in one request", async () => {
  const f = fixture({
    ageDays: 1,
    posts: [
      {
        ...photo,
        media_type: "CAROUSEL_ALBUM",
        children: {
          data: [
            {
              id: "child",
              media_type: "IMAGE",
              media_url: "https://example.com/child.jpg",
            },
          ],
        },
      },
    ],
  });
  const feed = await f.service().getFeed();
  assert.equal(feed.posts[0].children[0].id, "child");
  assert.match(f.calls.at(-1).url.searchParams.get("fields"), /children\{id/);
});
test("cron authentication rejects missing configuration, missing auth, and wrong secrets", () => {
  assert.equal(
    isCronAuthorized(new Request("https://example.com"), undefined),
    false,
  );
  assert.equal(
    isCronAuthorized(
      new Request("https://example.com", {
        headers: { authorization: "Bearer undefined" },
      }),
      undefined,
    ),
    false,
  );
  assert.equal(
    isCronAuthorized(
      new Request("https://example.com", {
        headers: { authorization: "Bearer wrong" },
      }),
      "secret",
    ),
    false,
  );
  assert.equal(
    isCronAuthorized(
      new Request("https://example.com", {
        headers: { authorization: "Bearer secret" },
      }),
      "secret",
    ),
    true,
  );
});
