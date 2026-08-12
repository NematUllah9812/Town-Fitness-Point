import { NextResponse, type NextRequest } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";
import { getServiceClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

/**
 * Unsubscribe endpoint.
 *
 * GET /api/unsubscribe?token=…
 *
 * 1. Verifies the signed HMAC token (expiry included) server-side.
 * 2. If valid, sets subscribed=false via the SERVICE client.
 * 3. Redirects to a status page. There is no public UPDATE path to this
 *    table — the anon key cannot unsubscribe or modify anyone.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";

  const email = verifyUnsubscribeToken(token);
  if (!email) {
    return NextResponse.redirect(
      new URL("/unsubscribe?status=invalid", request.url)
    );
  }

  if (!env.supabaseConfigured) {
    return NextResponse.redirect(
      new URL("/unsubscribe?status=demo", request.url)
    );
  }

  try {
    const service = getServiceClient();
    const { error } = await service
      .from("newsletter_subscribers")
      .update({ subscribed: false })
      .eq("email", email);
    if (error) {
      console.error("[unsubscribe] update failed:", error.message);
      return NextResponse.redirect(
        new URL("/unsubscribe?status=error", request.url)
      );
    }
  } catch (err) {
    console.error("[unsubscribe] service client error:", err);
    return NextResponse.redirect(
      new URL("/unsubscribe?status=error", request.url)
    );
  }

  return NextResponse.redirect(
    new URL("/unsubscribe?status=success", request.url)
  );
}
