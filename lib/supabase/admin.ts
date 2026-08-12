import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Server-only client using the SERVICE ROLE key.
 *
 * Must NEVER be imported from client components or used in browser code.
 * This client bypasses RLS — it is reserved for:
 *   - admin authorization lookups (requireAdmin)
 *   - writing public form submissions + rate limiting (actions)
 *   - admin CRUD operations
 * Everything it touches is additionally guarded by server-side checks.
 */
export function getServiceClient() {
  if (!env.supabaseConfigured || !env.serviceRoleKey) {
    throw new Error(
      "Supabase service role is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (server-side only)."
    );
  }
  return createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
