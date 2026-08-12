"use client";

import { useActionState, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { subscribeNewsletter, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { ok: false, error: "" };

/** Footer newsletter capture — server action with validation + rate limit. */
export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initialState);
  const [done, setDone] = useState(false);
  const demo = state.ok === true && state.demo === true;

  useEffect(() => {
    if (state.ok) setDone(true);
  }, [state]);

  if (done) {
    return (
      <p className="mt-5 flex items-center gap-2 text-sm text-lime" role="status">
        <CheckCircle2 className="size-4" aria-hidden />
        {demo ? "Demo mode — nothing was sent." : "You are in. See you Sunday."}
      </p>
    );
  }

  return (
    <form action={action} className="mt-5" noValidate>
      <div className="flex items-stretch gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          maxLength={160}
          placeholder="you@email.com"
          className="w-full min-w-0 rounded-md border border-titanium bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-lime focus:outline-none"
        />
        {/* Honeypot */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-lime px-4 text-obsidian transition hover:bg-lime-strong disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />}
        </button>
      </div>
      {state.ok === false && state.error ? (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
