import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

/** Minimal status page for the newsletter unsubscribe flow. */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const states: Record<string, { title: string; body: string }> = {
    success: {
      title: "You are unsubscribed.",
      body: "You will no longer receive our weekly training emails. If this was a mistake, you can resubscribe anytime on the website footer.",
    },
    invalid: {
      title: "This link is invalid or expired.",
      body: "Unsubscribe links are single-use and expire after 7 days. Use the unsubscribe link from your latest email to manage your subscription.",
    },
    demo: {
      title: "Demo mode — nothing to unsubscribe from.",
      body: "No database is connected in this environment. In production this page handles real unsubscribes.",
    },
    error: {
      title: "Something went wrong.",
      body: "We could not process your request. Please try again, or email us and we will remove you manually.",
    },
  };

  const state = states[status ?? ""] ?? states.invalid;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center text-ink">
      <p className="kicker">Town Fitness Point</p>
      <h1 className="mt-4 max-w-md font-display text-3xl font-bold tracking-tight">
        {state.title}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">
        {state.body}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-lime px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong"
      >
        Back to Home
      </Link>
    </main>
  );
}
