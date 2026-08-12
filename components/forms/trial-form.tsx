"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitTrialRequest, type ActionResult } from "@/lib/actions";
import { Turnstile } from "@/components/forms/turnstile";

const initialState: ActionResult = { ok: false, error: "" };

/** Free-trial request form (modal body). Server action does validation,
 *  honeypot, rate limiting and Turnstile verification. */
export function TrialForm({ onDone }: { onDone: () => void }) {
  const [state, action, pending] = useActionState(submitTrialRequest, initialState);
  const [done, setDone] = useState(false);
  const demo = state.ok === true && state.demo === true;

  useEffect(() => {
    if (state.ok) {
      setDone(true);
      const t = window.setTimeout(onDone, 4000);
      return () => window.clearTimeout(t);
    }
  }, [state, onDone]);

  if (done) {
    return (
      <div className="py-6 text-center">
        <CheckCircle2 className="mx-auto size-12 text-lime" aria-hidden />
        <h3 className="mt-4 font-display text-2xl font-bold">Request received</h3>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          {demo
            ? "Demo mode — no database is connected, so nothing was sent. Once Supabase is configured this request is stored and you get a call within 24 hours."
            : "Thanks — a coach will call you within 24 hours to confirm your session."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate>
      <p className="kicker">Free trial</p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
        Book Your Free Session
      </h2>
      <p className="mt-2 text-sm text-mist">
        One free 60-minute session. No pressure, no obligation.
      </p>

      <div className="mt-6 space-y-4">
        <Field label="Full name" htmlFor="trial-name" error={undefined}>
          <input
            id="trial-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Your name"
            className={inputCls}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" htmlFor="trial-email" error={undefined}>
            <input
              id="trial-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={160}
              placeholder="you@email.com"
              className={inputCls}
            />
          </Field>
          <Field label="Phone" htmlFor="trial-phone" error={undefined}>
            <input
              id="trial-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={24}
              placeholder="03xx-xxxxxxx"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Interested class (optional)" htmlFor="trial-class" error={undefined}>
          <select id="trial-class" name="preferredClassId" className={inputCls}>
            <option value="">Any — show me everything</option>
            <option value="strength">Strength & Conditioning</option>
            <option value="hiit">HIIT</option>
            <option value="crossfit">CrossFit-Style WOD</option>
            <option value="boxing">Boxing</option>
            <option value="yoga">Yoga & Mobility</option>
            <option value="spin">Spin / Cycling</option>
            <option value="functional">Functional Training</option>
          </select>
        </Field>

        <Field label="Anything we should know?" htmlFor="trial-notes" error={undefined}>
          <textarea
            id="trial-notes"
            name="notes"
            rows={2}
            maxLength={500}
            placeholder="Goals, injuries, questions…"
            className={inputCls}
          />
        </Field>

        {/* Honeypot — invisible to humans */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <Turnstile id="trial" />

        {state.ok === false && state.error ? (
          <p className="text-sm text-red-400" role="alert">
            {state.error}
          </p>
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
            "Request My Free Session"
          )}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-titanium bg-obsidian px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-lime focus:outline-none";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
