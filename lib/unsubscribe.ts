import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { env } from "@/lib/env";

/**
 * Signed, expiring unsubscribe tokens.
 *
 * token = base64url(email|expiry) "." base64url(HMAC-SHA256(secret, payload))
 *
 * The token is the ONLY thing that can flip a subscriber to unsubscribed,
 * because the newsletter table has no public UPDATE policy (0003 fix).
 * Verification happens server-side; the update runs with the service client.
 */

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function secret(): string {
  return env.newsletterSigningSecret;
}

export function signUnsubscribeToken(email: string): string {
  const key = secret();
  if (!key) return "";
  const payload = Buffer.from(
    `${email}|${Date.now() + TOKEN_TTL_MS}`
  ).toString("base64url");
  const sig = createHmac("sha256", key).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** Returns the email if the token is valid and unexpired, else null. */
export function verifyUnsubscribeToken(token: string): string | null {
  const key = secret();
  if (!key) return null;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = createHmac("sha256", key).update(payload).digest();
  const provided = Buffer.from(sig, "base64url");
  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(provided, expected)) return null;

  const decoded = Buffer.from(payload, "base64url").toString();
  const [email, expiry] = decoded.split("|");
  if (!email || !expiry) return null;
  if (Number(expiry) < Date.now()) return null;
  return email;
}
