"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitContactMessage, type ActionResult } from "@/lib/actions";
import { Turnstile } from "@/components/forms/turnstile";

const initialState: ActionResult = { ok: false, error: "" };

/** Contact form — server action: validation, honeypot, rate limit, Turnstile. */
export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactMessage, initialState);
  const [done, setDone] = useState(false);
  const demo = state.ok === true && state.demo === true;

  useEffect(() => {
    if (state.ok) setDone(true);
  }, [state]);

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-surface p-10 text-center">
        <CheckCircle2 className="size-12 text-lime" aria-hidden />
        <h3 className="mt-4 font-display text-2xl font-bold">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
          {demo
            ? "Demo mode — no database is connected, so nothing was sent."
            : "Thanks — we usually reply within one business day."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="rounded-xl border border-hairline bg-surface p-8">
      <h3 className="font-display text-xl font-bold tracking-tight">Send a Message</h3>
      <p className="mt-2 text-sm text-mist">Questions, feedback, partnerships — the floor is listening.</p>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelCls}>Full name</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required maxLength={80} placeholder="Your name" className={inputCls} />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelCls}>Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={160} placeholder="you@email.com" className={inputCls} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className={labelCls}>Phone (optional)</label>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={24} placeholder="03xx-xxxxxxx" className={inputCls} />
          </div>
          <div>
            <label htmlFor="contact-subject" className={labelCls}>Subject</label>
            <input id="contact-subject" name="subject" type="text" required maxLength={120} placeholder="What is this about?" className={inputCls} />
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className={labelCls}>Message</label>
          <textarea id="contact-message" name="message" rows={5} required maxLength={2000} placeholder="Write your message…" className={inputCls} />
        </div>

        {/* Honeypot — invisible to humans */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <Turnstile id="contact" />

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
            "Send Message"
          )}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-titanium bg-obsidian px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-lime focus:outline-none";

const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist";
