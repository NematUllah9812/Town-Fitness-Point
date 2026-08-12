import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="kicker mb-4">404</p>
      <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
        Wrong Turn. Wrong Rep.
      </h1>
      <p className="mt-4 max-w-md text-mist">
        The page you are looking for does not exist. Let us get you back on
        the floor.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-lime px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Home
      </Link>
    </main>
  );
}
