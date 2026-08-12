import "server-only";

import { getServiceClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

/**
 * Sliding-window rate limiting backed by the `rate_limits` table.
 * Lives in Postgres so it holds across serverless instances and
 * restarts. There is no anon access to this table (RLS: no policies),
 * so it can only be written through the service client server-side.
 */

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24h sliding window
const DEFAULT_MAX = 5;

export async function rateLimit(
  scope: string,
  key: string,
  max = DEFAULT_MAX
): Promise<{ ok: boolean; retryAfterMs?: number }> {
  if (!env.supabaseConfigured) return { ok: true }; // demo mode: no DB to limit against

  const service = getServiceClient();
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

  const { data: existing } = await service
    .from("rate_limits")
    .select("window_start, count")
    .eq("scope", scope)
    .eq("key", key)
    .gte("window_start", windowStart)
    .maybeSingle();

  if (existing && Number(existing.count) >= max) {
    const retryAfterMs =
      new Date(existing.window_start).getTime() + WINDOW_MS - Date.now();
    return { ok: false, retryAfterMs: Math.max(retryAfterMs, 60_000) };
  }

  if (existing) {
    await service
      .from("rate_limits")
      .update({ count: Number(existing.count) + 1 })
      .eq("scope", scope)
      .eq("key", key)
      .eq("window_start", existing.window_start);
  } else {
    // best-effort insert; conflicts are acceptable (counts may drift low)
    await service.from("rate_limits").insert({
      scope,
      key,
      window_start: new Date().toISOString(),
      count: 1,
    });
  }
  return { ok: true };
}

/**
 * Server-side Turnstile verification.
 * Active only when TURNSTILE_SECRET_KEY is set; when TURNSTILE_REQUIRED
 * is true, missing tokens are rejected instead of skipped.
 */
export async function verifyTurnstile(token: string | null): Promise<boolean> {
  if (!env.turnstileSecretKey) {
    return !env.turnstileRequired;
  }
  if (!token) return !env.turnstileRequired;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.turnstileSecretKey,
        response: token,
      }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return !env.turnstileRequired;
  }
}
