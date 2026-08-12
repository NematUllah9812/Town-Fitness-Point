"use server";

import { headers } from "next/headers";
import {
  trialRequestSchema,
  newsletterSchema,
  membershipInquirySchema,
  contactMessageSchema,
} from "@/lib/validators";
import { rateLimit, verifyTurnstile } from "@/lib/rate-limit";
import { getServiceClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import {
  sendAdminNotification,
  sendTrialConfirmation,
  sendInquiryConfirmation,
  sendContactConfirmation,
  sendNewsletterWelcome,
} from "@/lib/email";
import { signUnsubscribeToken } from "@/lib/unsubscribe";

/**
 * Public form Server Actions.
 *
 * Every action:
 *   1. rejects honeypot bots (silently, so bots can't learn),
 *   2. validates input server-side with zod,
 *   3. verifies Turnstile when configured (required when TURNSTILE_REQUIRED),
 *   4. rate-limits per IP + per email (Postgres-backed),
 *   5. inserts via the SERVICE client — the only writer with RLS bypass,
 *      and even it only touches the submission tables.
 *
 * Emails (Resend) are sent from here in Phase 3.
 */

export type ActionResult =
  | { ok: true; demo?: boolean }
  | { ok: false; error: string };

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return "local";
}

/** Honeypot: bots fill hidden fields; pretend success so they learn nothing. */
function isBot(formData: FormData): boolean {
  return typeof formData.get("company") === "string" && formData.get("company") !== "";
}

export async function submitTrialRequest(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  if (isBot(formData)) return { ok: true };

  const parsed = trialRequestSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    preferredClassId: formData.get("preferredClassId") || null,
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please check your details and try again." };
  }

  const turnstileOk = await verifyTurnstile(
    (formData.get("cf-turnstile-response") as string) || null
  );
  if (!turnstileOk) {
    return { ok: false, error: "Bot check failed. Please try again." };
  }

  const ip = await clientIp();
  const byIp = await rateLimit("trial", `ip:${ip}`);
  const byEmail = await rateLimit("trial", `email:${parsed.data.email}`);
  if (!byIp.ok || !byEmail.ok) {
    return {
      ok: false,
      error: "Too many requests. Please try again in a few hours.",
    };
  }

  if (!env.supabaseConfigured) {
    // Demo mode — be explicit that nothing was actually submitted.
    return { ok: true, demo: true };
  }

  const service = getServiceClient();

  // Resolve a class slug (from the form) to its DB id; null if unknown.
  let preferredClassId: string | null = null;
  if (parsed.data.preferredClassId) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      parsed.data.preferredClassId
    );
    if (isUuid) {
      preferredClassId = parsed.data.preferredClassId;
    } else {
      const { data: cls } = await service
        .from("classes")
        .select("id")
        .eq("slug", parsed.data.preferredClassId)
        .maybeSingle();
      preferredClassId = (cls?.id as string | undefined) ?? null;
    }
  }

  const { error } = await service.from("free_trial_requests").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    preferred_class_id: preferredClassId,
    notes: parsed.data.notes,
    source: "website",
  });
  if (error) {
    console.error("[action] trial insert failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  await Promise.allSettled([
    sendAdminNotification(
      "New free-trial request",
      `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone}\nClass: ${parsed.data.preferredClassId ?? "any"}\nNotes: ${parsed.data.notes || "—"}`
    ),
    sendTrialConfirmation(parsed.data.email, parsed.data.name),
  ]);

  return { ok: true };
}

export async function submitMembershipInquiry(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  if (isBot(formData)) return { ok: true };

  const parsed = membershipInquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    planId: formData.get("planId") || null,
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please check your details and try again." };
  }

  const turnstileOk = await verifyTurnstile(
    (formData.get("cf-turnstile-response") as string) || null
  );
  if (!turnstileOk) {
    return { ok: false, error: "Bot check failed. Please try again." };
  }

  const ip = await clientIp();
  const byIp = await rateLimit("inquiry", `ip:${ip}`);
  const byEmail = await rateLimit("inquiry", `email:${parsed.data.email}`);
  if (!byIp.ok || !byEmail.ok) {
    return {
      ok: false,
      error: "Too many requests. Please try again in a few hours.",
    };
  }

  if (!env.supabaseConfigured) {
    return { ok: true, demo: true };
  }

  const service = getServiceClient();

  // Resolve a plan slug (from the form) to its DB id; null if unknown.
  let planId: string | null = null;
  if (parsed.data.planId) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      parsed.data.planId
    );
    if (isUuid) {
      planId = parsed.data.planId;
    } else {
      const { data: plan } = await service
        .from("membership_plans")
        .select("id")
        .eq("slug", parsed.data.planId)
        .maybeSingle();
      planId = (plan?.id as string | undefined) ?? null;
    }
  }

  const { error } = await service.from("membership_inquiries").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    plan_id: planId,
    message: parsed.data.message,
  });
  if (error) {
    console.error("[action] inquiry insert failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  await Promise.allSettled([
    sendAdminNotification(
      "New membership inquiry",
      `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone}\nPlan: ${parsed.data.planId ?? "not sure"}\nMessage: ${parsed.data.message || "—"}`
    ),
    sendInquiryConfirmation(parsed.data.email, parsed.data.name),
  ]);

  return { ok: true };
}

export async function submitContactMessage(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  if (isBot(formData)) return { ok: true };

  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please check your details and try again." };
  }

  const turnstileOk = await verifyTurnstile(
    (formData.get("cf-turnstile-response") as string) || null
  );
  if (!turnstileOk) {
    return { ok: false, error: "Bot check failed. Please try again." };
  }

  const ip = await clientIp();
  const byIp = await rateLimit("contact", `ip:${ip}`);
  const byEmail = await rateLimit("contact", `email:${parsed.data.email}`);
  if (!byIp.ok || !byEmail.ok) {
    return {
      ok: false,
      error: "Too many requests. Please try again in a few hours.",
    };
  }

  if (!env.supabaseConfigured) {
    return { ok: true, demo: true };
  }

  const service = getServiceClient();
  const { error } = await service.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });
  if (error) {
    console.error("[action] contact insert failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  await Promise.allSettled([
    sendAdminNotification(
      "New contact message",
      `From: ${parsed.data.name} <${parsed.data.email}>${parsed.data.phone ? `\nPhone: ${parsed.data.phone}` : ""}\nSubject: ${parsed.data.subject}\n\n${parsed.data.message}`
    ),
    sendContactConfirmation(parsed.data.email, parsed.data.name),
  ]);

  return { ok: true };
}

export async function subscribeNewsletter(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  if (isBot(formData)) return { ok: true };

  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const turnstileOk = await verifyTurnstile(
    (formData.get("cf-turnstile-response") as string) || null
  );
  if (!turnstileOk) {
    return { ok: false, error: "Bot check failed. Please try again." };
  }

  const ip = await clientIp();
  const byIp = await rateLimit("newsletter", `ip:${ip}`);
  const byEmail = await rateLimit("newsletter", `email:${parsed.data.email}`);
  if (!byIp.ok || !byEmail.ok) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  if (!env.supabaseConfigured) {
    return { ok: true, demo: true };
  }

  const service = getServiceClient();
  const { error } = await service.from("newsletter_subscribers").upsert(
    {
      email: parsed.data.email,
      source: "footer",
      subscribed: true,
    },
    { onConflict: "email" }
  );
  if (error) {
    console.error("[action] newsletter insert failed:", error.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  // Welcome email with a signed unsubscribe link (HMAC, 7-day expiry).
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const token = signUnsubscribeToken(parsed.data.email);
  const unsubscribeUrl = token
    ? `${baseUrl}/api/unsubscribe?token=${token}`
    : "";
  if (unsubscribeUrl) {
    await sendNewsletterWelcome(parsed.data.email, unsubscribeUrl);
  }

  return { ok: true };
}
