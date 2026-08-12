import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Browser client — anon key only; RLS governs everything it can touch.
 * Used solely by admin sign-in. Public site content never loads through
 * this client (it is fetched server-side via lib/content.ts).
 */
export function getBrowserSupabase() {
  if (!env.supabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    );
  }
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
