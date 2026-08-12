"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitMembershipInquiry, type ActionResult } from "@/lib/actions";
import { Turnstile } from "@/components/forms/turnstile";
import type { MembershipPlan } from "@/lib/types";

const initialState: ActionResult = { ok: false, error: "" };

/**
 * Membership inquiry form — plan pre-selected from the pricing cards
 * (?plan=slug). Server action: validation, honeypot, rate limit,
 * Turnstile, service-client insert.
 */
export function MembershipInquiryForm({
  plans,
  initialPlan,
}: {
  plans: MembershipPlan[];
  initialPlan?: string;
}) {
  const [state, action, pending] = useActionState(submitMembershipInquiry, initialState);
  const [done, setDone] = useState(false);
  const demo = state.ok === true && state.demo === true;

  useEffect(() => {
    if (state.ok) setDone(true);
  }, [state]);

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-hairline bg-surface p-10 text-center">
        <CheckCircle2 className="size-12 text-lime" aria-hidden />
        <h3 className="mt-4 font-display text-2xl font-bold">Inquiry received</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
          {demo
            ? "Demo mode — no database is connected, so nothing was sent. Once Supabase is configured, we reply within 24 hours."
            : "Thanks — a membership advisor will call you within 24 hours to walk you through the plan."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="rounded-xl border border-hairline bg-surface p-8">
      <h3 className="font-display text-xl font-bold tracking-tight">Ask About Membership</h3>
      <p className="mt-2 text-sm text-mist">
        Tell us which plan you are considering — we will call you back.
      </p>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry-name" className={labelCls}>Full name</label>
            <input id="inquiry-name" name="name" type="text" autoComplete="name" required maxLength={80} placeholder="Your name" className={inputCls} />
          </div>
          <div>
            <label htmlFor="inquiry-email" className={labelCls}>Email</label>
            <input id="inquiry-email" name="email" type="email" autoComplete="email" required maxLength={160} placeholder="you@email.com" className={inputCls} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry-phone" className={labelCls}>Phone</label>
            <input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" required maxLength={24} placeholder="03xx-xxxxxxx" className={inputCls} />
          </div>
          <div>
            <label htmlFor="inquiry-plan" className={labelCls}>Plan of interest</label>
            <select id="inquiry-plan" name="planId" defaultValue={initialPlan ?? ""} className={inputCls}>
              <option value="">Not sure yet</option>
              {plans.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name}
                  {p.pricePkr !== null ? ` — Rs ${p.pricePkr.toLocaleString("en-PK")}` : " — contact us"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="inquiry-message" className={labelCls}>Questions (optional)</label>
          <textarea id="inquiry-message" name="message" rows={3} maxLength={1000} placeholder="Anything we should know?" className={inputCls} />
        </div>

        {/* Honeypot — invisible to humans */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <Turnstile id="inquiry" />

        {state.ok === false && state.error ? (
          <p className="text-sm text-red-400" role="alert">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-lime px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            "Send Inquiry"
          )}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-titanium bg-obsidian px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-lime focus:outline-none";

const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist";
