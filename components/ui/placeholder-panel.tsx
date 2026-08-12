import type { ReactNode } from "react";

/**
 * Consistent "real content not provided yet" panel.
 * Clearly-labeled placeholder — never invents business facts.
 */
export function PlaceholderPanel({
  label,
  children,
  className = "",
}: {
  label: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-dashed border-titanium bg-obsidian/40 p-6 ${className}`}
    >
      <span className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-faint">
        [PLACEHOLDER]
      </span>
      {children ? (
        <div className="mt-3 text-sm leading-relaxed text-mist">{children}</div>
      ) : null}
    </div>
  );
}
