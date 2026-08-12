"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

/**
 * Destructive action button with an inline confirm step (no window.confirm,
 * keyboard accessible). The action itself is a server action that enforces
 * admin auth server-side.
 */
export function DeleteButton({
  id,
  action,
  label = "Delete",
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <form
          action={(fd) => {
            fd.set("id", id);
            startTransition(async () => {
              await action(fd);
            });
          }}
        >
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-red-500/15 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500/25 disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Confirm"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs text-faint underline-offset-2 hover:text-mist hover:underline"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-faint transition hover:bg-red-500/15 hover:text-red-400"
    >
      <Trash2 className="size-3.5" aria-hidden />
      {label}
    </button>
  );
}
