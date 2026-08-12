"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { env } from "@/lib/env";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!env.supabaseConfigured) {
    return (
      <p className="mt-6 rounded-md border border-titanium p-4 text-xs leading-relaxed text-mist">
        Demo mode: no Supabase connection. Add{" "}
        <code className="text-lime">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="text-lime">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to
        your environment to enable admin sign-in.
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const supabase = getBrowserSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      <div>
        <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-titanium bg-obsidian px-3.5 py-2.5 text-sm focus:border-lime focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-titanium bg-obsidian px-3.5 py-2.5 text-sm focus:border-lime focus:outline-none"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-lime px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Sign In
      </button>
    </form>
  );
}
