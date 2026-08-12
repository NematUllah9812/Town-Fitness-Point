import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/**
 * Shared admin form controls — consistent styling, accessible labels.
 * Purely presentational; actions live in the parent forms.
 */

const inputCls =
  "w-full rounded-md border border-titanium bg-obsidian px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-lime focus:outline-none";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">
        {label}
      </span>
      {children}
      {hint ? <p className="mt-1 text-xs text-faint">{hint}</p> : null}
    </div>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-mist">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-lime"
      />
      {label}
    </label>
  );
}

export function AdminSubmit({
  pendingLabel = "Saving…",
  label = "Save",
}: {
  pendingLabel?: string;
  label?: string;
}) {
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-md bg-lime px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong disabled:opacity-60"
    >
      {label}
    </button>
  );
}
