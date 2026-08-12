import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Server-side client using the ANON key.
 *
 * Used for all public content reads. Because RLS is enabled on every
 * table, this client can only ever see what anonymous visitors may see
 * (active classes, published testimonials, the public settings view, …).
 * This is the demonstration that RLS, not app code, is the security boundary.
 */
export function getAnonServerClient() {
  if (!env.supabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    );
  }
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false },
  });
}
