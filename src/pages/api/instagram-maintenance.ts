import type { APIRoute } from "astro";
import { instagram } from "../../lib/instagram-runtime";
import { InstagramError, isCronAuthorized } from "../../lib/instagram";

export const GET: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  };
  if (
    !isCronAuthorized(
      request,
      process.env.CRON_SECRET ?? import.meta.env.CRON_SECRET,
    )
  ) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers,
    });
  }
  try {
    return new Response(JSON.stringify(await instagram.maintain()), {
      headers,
    });
  } catch (error) {
    const code =
      error instanceof InstagramError ? error.code : "maintenance_failed";
    console.error(`[Instagram maintenance] ${code}`);
    return new Response(JSON.stringify({ healthy: false, error: code }), {
      status: 503,
      headers,
    });
  }
};
