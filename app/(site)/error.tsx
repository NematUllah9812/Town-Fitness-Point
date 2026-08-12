"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary for the marketing site.
 * Shows a calm, on-brand message with a retry; logs the error server-side
 * via the digest. (Next.js provides `reset` to re-render the segment.)
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="kicker">Error</p>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
        The Floor Hit a Snag.
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-mist">
        Something unexpected happened. Try again — if it keeps happening,
        send us a message and we will sort it out.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-md bg-lime px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong"
      >
        Try Again
      </button>
    </main>
  );
}
