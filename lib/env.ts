/**
 * Environment access — single place that reads process.env so the rest of
 * the app never touches raw env vars. All optional values are typed.
 */

export const env = {
  get supabaseConfigured(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  },
  get supabaseUrl(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  },
  get supabaseAnonKey(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  },
  /** Service-role key — SERVER ONLY. Never reference this in client code. */
  get serviceRoleKey(): string {
    return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  },
  get resendApiKey(): string {
    return process.env.RESEND_API_KEY ?? "";
  },
  get resendFromEmail(): string {
    return process.env.RESEND_FROM_EMAIL ?? "";
  },
  get adminNotifyEmail(): string {
    return process.env.ADMIN_NOTIFY_EMAIL ?? "";
  },
  /** Secret for signing newsletter unsubscribe tokens (HMAC). */
  get newsletterSigningSecret(): string {
    return process.env.NEWSLETTER_SIGNING_SECRET ?? "";
  },
  get turnstileSiteKey(): string {
    return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  },
  get turnstileSecretKey(): string {
    return process.env.TURNSTILE_SECRET_KEY ?? "";
  },
  get turnstileRequired(): boolean {
    return process.env.TURNSTILE_REQUIRED === "true";
  },
  /**
   * DATA_MODE: "auto" | "mock" | "supabase"
   * auto => Supabase when env vars are present, otherwise mock fallback.
   */
  get dataMode(): "auto" | "mock" | "supabase" {
    const mode = process.env.DATA_MODE;
    if (mode === "mock" || mode === "supabase") return mode;
    return "auto";
  },
  get useMockData(): boolean {
    if (this.dataMode === "supabase") return false;
    if (this.dataMode === "mock") return true;
    return !this.supabaseConfigured;
  },
};
