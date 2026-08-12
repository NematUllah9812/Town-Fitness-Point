"use client";

import { useTransition } from "react";
import { adminUpdateSubmissionStatus } from "@/lib/admin-actions";

const STATUS_COLORS: Record<string, string> = {
  new: "border-lime/60 bg-lime/10 text-lime",
  contacted: "border-sky-400/50 bg-sky-400/10 text-sky-300",
  booked: "border-violet-400/50 bg-violet-400/10 text-violet-300",
  converted: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300",
  resolved: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300",
  cancelled: "border-titanium bg-obsidian/60 text-faint",
};

/**
 * Inline status select for submission rows. Submits on change through the
 * admin server action (requireAdmin + zod-validated status list).
 */
export function StatusSelect({
  table,
  id,
  current,
  options,
}: {
  table: "free_trial_requests" | "membership_inquiries" | "contact_messages";
  id: string;
  current: string;
  options: string[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <form
        action={(fd) => {
          fd.set("table", table);
          fd.set("id", id);
          startTransition(() => adminUpdateSubmissionStatus(fd));
        }}
      >
        <input type="hidden" name="table" value={table} />
        <input type="hidden" name="id" value={id} />
        <select
          name="status"
          defaultValue={current}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          disabled={pending}
          className={`cursor-pointer rounded-sm border px-2 py-1 text-[0.7rem] font-bold uppercase tracking-wider focus:outline-none ${
            STATUS_COLORS[current] ?? "border-titanium text-mist"
          }`}
          aria-label="Submission status"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </form>
      {pending ? (
        <span className="text-xs text-faint" aria-live="polite">
          saving…
        </span>
      ) : null}
    </div>
  );
}
