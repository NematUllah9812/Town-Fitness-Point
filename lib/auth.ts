import { redirect } from "next/navigation";
import { getSsrClient } from "@/lib/supabase/ssr";
import { getServiceClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
}

/**
 * Non-throwing variant for layouts: returns the admin (or null) without
 * redirecting. Real enforcement happens in requireAdmin() on every page.
 */
export async function getAdminOrNull(): Promise<AdminUser | null> {
  if (!env.supabaseConfigured) return null;
  try {
    const supabase = await getSsrClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const service = getServiceClient();
    const { data: profile } = await service
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile || profile.role !== "admin") return null;
    return { id: user.id, email: user.email ?? "", fullName: profile.full_name };
  } catch (err) {
    console.error("[auth] getAdminOrNull:", err);
    return null;
  }
}

/**
 * Server-side authorization gate for admin routes.
 * Client-side checks are NOT security — every admin page goes through this.
 */
export async function requireAdmin(): Promise<AdminUser> {
  if (!env.supabaseConfigured) {
    // Honest degradation: without a database there is no auth.
    redirect("/admin/login?reason=not-configured");
  }

  const supabase = await getSsrClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  // Role check against the database via the service client.
  // RLS also enforces this, but we verify again here in app code.
  const service = getServiceClient();
  const { data: profile } = await service
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login?reason=forbidden");
  }

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile.full_name,
  };
}
