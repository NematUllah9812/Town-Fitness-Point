import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { getAdminOrNull } from "@/lib/auth";
import { env } from "@/lib/env";
import { adminLogout } from "@/lib/admin-actions";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin shell. NOTE: this layout does NOT throw for unauthenticated
 * visitors (the login page lives under this segment) — instead it only
 * renders the shell when a verified admin session exists. Every admin
 * PAGE calls requireAdmin() itself; that is the enforcement boundary.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await getAdminOrNull();

  return (
    <div className="min-h-screen bg-obsidian">
      {admin ? (
        <header className="sticky top-0 z-40 border-b border-hairline bg-obsidian/90 backdrop-blur-md">
          <div className="container-x flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="font-display text-xs font-bold uppercase tracking-[0.2em]"
              >
                TFP <span className="text-lime">Admin</span>
              </Link>
              <Link
                href="/"
                className="hidden items-center gap-1 text-xs text-faint transition hover:text-lime sm:inline-flex"
              >
                View site <ExternalLink className="size-3" aria-hidden />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-mist md:inline">{admin.email}</span>
              <form action={adminLogout}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-md border border-titanium px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-mist transition hover:border-lime hover:text-lime"
                >
                  <LogOut className="size-3.5" aria-hidden />
                  Sign out
                </button>
              </form>
            </div>
          </div>
          <div className="container-x pb-2">
            <AdminNav />
          </div>
        </header>
      ) : null}
      {children}
      {!env.supabaseConfigured ? (
        <div className="container-x pb-10">
          <p className="rounded-md border border-titanium p-4 text-xs leading-relaxed text-mist">
            Demo mode: no Supabase connection — the dashboard is locked until
            environment variables are configured.
          </p>
        </div>
      ) : null}
    </div>
  );
}
