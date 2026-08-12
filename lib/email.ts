import "server-only";

import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Transactional email layer (Resend). SERVER-SIDE ONLY.
 * Every send is best-effort: a failing email never fails the form
 * submission that triggered it. Keys live in env, never in the client.
 *
 * SECURITY: shell() HTML-escapes every interpolated value. Public forms
 * (name, email, phone, message, notes, …) feed the admin notification
 * and confirmation bodies, so unescaped HTML would let any visitor
 * inject markup/scripts into emails that land in the admin inbox.
 */

export type SendResult = { ok: boolean; skipped?: boolean };

async function send({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  if (!env.resendApiKey || !env.resendFromEmail) {
    return { ok: false, skipped: true };
  }
  try {
    const resend = new Resend(env.resendApiKey);
    await resend.emails.send({ from: env.resendFromEmail, to, subject, html, text });
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false };
  }
}

/** HTML-escape user-supplied text before it enters an email body. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shell(title: string, body: string, cta?: { label: string; url: string }) {
  // Escape EVERYTHING that is interpolated — title/body come from
  // form-derived content; the CTA label/url are escaped for defense in depth.
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body);
  const safeCtaLabel = cta ? escapeHtml(cta.label) : "";
  const safeCtaUrl = cta ? escapeHtml(cta.url) : "";

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#0d0d0d;font-family:Arial,sans-serif;color:#f5f5f0">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">
    <p style="color:#c6ff00;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:bold">Town Fitness Point</p>
    <h1 style="font-size:26px;line-height:1.3;margin:16px 0">${safeTitle}</h1>
    <div style="font-size:15px;line-height:1.7;color:#c9c9c4;white-space:pre-wrap">${safeBody}</div>
    ${cta ? `<p style="margin:28px 0"><a href="${safeCtaUrl}" style="background:#c6ff00;color:#0d0d0d;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:bold;font-size:14px">${safeCtaLabel}</a></p>` : ""}
    <p style="margin-top:36px;font-size:12px;color:#777">Strength is built here. · Town Fitness Point</p>
  </div>
</body></html>`;
}

export async function sendAdminNotification(subject: string, body: string) {
  if (!env.adminNotifyEmail) return { ok: false, skipped: true };
  return send({
    to: env.adminNotifyEmail,
    subject: `[TFP] ${subject}`,
    html: shell(subject, body),
    text: body,
  });
}

export async function sendTrialConfirmation(to: string, name: string) {
  const body = `Hi ${name},

Your free trial request at Town Fitness Point has been received. A coach will call you within 24 hours to confirm your session time.

If you have any questions, just reply to this email.`;
  return send({
    to,
    subject: "Your free trial request — Town Fitness Point",
    html: shell("Your free session is on the way", body),
    text: body,
  });
}

export async function sendInquiryConfirmation(to: string, name: string) {
  const body = `Hi ${name},

Thanks for your membership inquiry. A membership advisor will call you within 24 hours to walk you through the plans.

In the meantime, your first session is always free.`;
  return send({
    to,
    subject: "Membership inquiry received — Town Fitness Point",
    html: shell("We received your inquiry", body),
    text: body,
  });
}

export async function sendContactConfirmation(to: string, name: string) {
  const body = `Hi ${name},

We received your message and will reply shortly — usually within one business day.

Town Fitness Point`;
  return send({
    to,
    subject: "Message received — Town Fitness Point",
    html: shell("We got your message", body),
    text: body,
  });
}

export async function sendNewsletterWelcome(to: string, unsubscribeUrl: string) {
  const body = `Welcome to the Town Fitness Point weekly.

One email a week: programming tips, nutrition notes and what's new on the floor. No spam, no noise.

You can unsubscribe at any time: ${unsubscribeUrl}`;
  return send({
    to,
    subject: "You are in — Town Fitness Point weekly",
    html: shell(
      "Welcome to the weekly",
      "One email a week: programming tips, nutrition notes and what's new on the floor. No spam, no noise.",
      { label: "Unsubscribe", url: unsubscribeUrl }
    ),
    text: body,
  });
}
