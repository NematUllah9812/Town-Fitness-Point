import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** Admin login — Supabase Auth (email/password). No custom auth, ever. */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  const notices: Record<string, string> = {
    "not-configured":
      "Supabase is not configured — admin access is unavailable in demo mode. Add your Supabase env vars to enable it.",
    forbidden: "This account does not have admin access.",
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <Link href="/" className="mb-10 font-display text-sm font-bold uppercase tracking-[0.2em]">
        Town <span className="text-lime">Fitness</span> Point
      </Link>
      <div className="w-full max-w-sm rounded-xl border border-hairline bg-surface p-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Admin Sign In</h1>
        <p className="mt-2 text-sm text-mist">
          Authorized staff only. Authentication is handled by Supabase Auth.
        </p>
        {reason && notices[reason] ? (
          <p className="mt-4 rounded-md border border-lime/40 bg-lime/10 p-3 text-xs leading-relaxed text-lime">
            {notices[reason]}
          </p>
        ) : null}
        <AdminLoginForm />
      </div>
    </main>
  );
}
