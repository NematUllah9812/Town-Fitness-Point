import type { ReactNode } from "react";

type Tone = "neutral" | "accent";

/** Small uppercase label chip — e.g. difficulty levels, plan tiers. */
export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-display text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
        tone === "accent"
          ? "border-lime/60 bg-lime/10 text-lime"
          : "border-titanium bg-obsidian/60 text-mist"
      } ${className}`}
    >
      {children}
    </span>
  );
}
