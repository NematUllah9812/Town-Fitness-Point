-- ============================================================================
-- Town Fitness Point — 0003_fix_newsletter_rls.sql
-- SECURITY FIX: remove the dangerously broad public UPDATE policy on
-- newsletter_subscribers.
--
-- The removed policy used `using (true) with check (true)`, which lets ANY
-- anonymous user (anon key) update ANY row in the table directly through
-- the Supabase client — e.g. flipping other subscribers' `subscribed` flag
-- or rewriting emails. RLS is enforced by Postgres, not by what the app UI
-- happens to call, so this was a real hole even though app code never
-- exploited it.
--
-- New model: public can INSERT only. Unsubscribes go through
-- app/api/unsubscribe with a signed, expiring HMAC token, verified
-- server-side; the update itself runs with the service-role client.
-- ============================================================================

drop policy if exists "subscribers_public_update_own"
  on public.newsletter_subscribers;

-- Sanity check (should return zero rows):
--   select policyname from pg_policies
--   where tablename = 'newsletter_subscribers'
--     and (policyname like '%update%' or policyname like '%delete%');

-- ---------------------------------------------------------------------------
-- Bonus (data quality, not security): unify membership plan feature strings
-- so the /membership comparison table derives a clean matrix (identical
-- feature strings across tiers). Idempotent — safe to re-run.
-- ---------------------------------------------------------------------------

update public.membership_plans set features = '{"Full gym floor access","Locker & changing rooms","Monthly fitness assessment","Free trial session included"}'::text[]
  where slug = 'essential';

update public.membership_plans set features = '{"Full gym floor access","Locker & changing rooms","Monthly fitness assessment","Free trial session included","Unlimited group classes","Quarterly coach check-in","Progress tracking","Guest pass every month"}'::text[]
  where slug = 'pro';

update public.membership_plans set features = '{"Full gym floor access","Locker & changing rooms","Monthly fitness assessment","Free trial session included","Unlimited group classes","Quarterly coach check-in","Progress tracking","Guest pass every month","Monthly personal training sessions","Nutrition guidance","Priority class booking","Recovery & mobility programming"}'::text[]
  where slug = 'elite';
