-- ============================================================================
-- Town Fitness Point — 0002_seed.sql
-- Seed data. Everything here is either structural (program list agreed in
-- the brief) or a clearly-marked placeholder. NO invented business facts:
-- prices are null, stats are null, no trainers/testimonials/blog/gallery
-- rows until real content is provided and added via the admin panel.
-- ============================================================================

-- --- Classes (program structure from the project brief) ---
insert into public.classes (slug, name, category, difficulty, description, duration_min, image_url, featured, sort_order) values
  ('strength-conditioning', 'Strength & Conditioning', 'strength', 'advanced',
   'Periodized barbell and rack work — squats, presses and pulls coached with intent. Built for lifters who want measurable progress.',
   60, '/images/classes/strength.jpg', true, 1),
  ('hiit', 'HIIT', 'cardio', 'intermediate',
   'Forty-five minutes of interval work designed to spike your engine and keep it there. Every session is scalable to your level.',
   45, '/images/classes/hiit.jpg', true, 2),
  ('crossfit-wod', 'CrossFit-Style WOD', 'strength', 'advanced',
   'High-intensity functional workouts — lifted, rowed, thrown and finished. Coached for safety first, intensity second.',
   60, null, false, 3),
  ('boxing', 'Boxing', 'combat', 'intermediate',
   'Striking fundamentals, footwork and bag work. A full-body engine builder disguised as a fight camp.',
   60, '/images/classes/boxing.jpg', true, 4),
  ('yoga-mobility', 'Yoga & Mobility', 'mind_body', 'beginner',
   'Strength through range of motion. A calm, dim-studio practice for recovery, flexibility and control.',
   60, '/images/classes/yoga.jpg', true, 5),
  ('spin', 'Spin / Cycling', 'cardio', 'beginner',
   'Ride to the beat. Low-impact, high-output conditioning that builds serious leg strength and aerobic base.',
   45, null, false, 6),
  ('functional-training', 'Functional Training', 'functional', 'intermediate',
   'Move well in every plane. Kettlebells, sleds, carries and bodyweight work for life and sport.',
   60, null, false, 7),
  ('personal-training', 'Personal Training', 'functional', 'beginner',
   'One-on-one coaching, custom programming and full accountability. The fastest route to your goal — whatever it is.',
   60, null, false, 8)
on conflict (slug) do nothing;

-- --- Membership plans (SAMPLE structure; prices deliberately null
--     → the site renders "Contact us" until the owner sets real prices.
--     Feature strings are shared across tiers so the /membership
--     comparison table derives a clean matrix) ---
insert into public.membership_plans (slug, name, price_pkr, period, tagline, features, popular, sort_order) values
  ('essential', 'Essential', null, 'monthly',
   'Consistent training, on your own terms.',
   '{"Full gym floor access","Locker & changing rooms","Monthly fitness assessment","Free trial session included"}'::text[],
   false, 1),
  ('pro', 'Pro', null, 'monthly',
   'Everything in Essential, plus the classes.',
   '{"Full gym floor access","Locker & changing rooms","Monthly fitness assessment","Free trial session included","Unlimited group classes","Quarterly coach check-in","Progress tracking","Guest pass every month"}'::text[],
   true, 2),
  ('elite', 'Elite', null, 'monthly',
   'Coached like an athlete, all year.',
   '{"Full gym floor access","Locker & changing rooms","Monthly fitness assessment","Free trial session included","Unlimited group classes","Quarterly coach check-in","Progress tracking","Guest pass every month","Monthly personal training sessions","Nutrition guidance","Priority class booking","Recovery & mobility programming"}'::text[],
   false, 3)
on conflict (slug) do nothing;

-- --- Site settings (the single place real business facts get filled in,
--     either via SQL below or the admin panel in Phase 3) ---
insert into public.site_settings (key, value) values
  ('business', jsonb_build_object(
     'name', 'Town Fitness Point',
     'tagline', 'Strength is built here.'
  )),
  ('contact', jsonb_build_object(
     'phone', null,  -- [ADD PHONE NUMBER]
     'email', null,  -- [ADD EMAIL ADDRESS]
     'address', null, -- [ADD GYM ADDRESS]
     'city', null     -- [ADD CITY]
  )),
  ('hours', jsonb_build_object(
     'weekdays', null, -- [ADD HOURS] e.g. "6:00 AM – 11:00 PM"
     'weekend', null   -- [ADD HOURS] e.g. "8:00 AM – 9:00 PM"
  )),
  ('socials', jsonb_build_object(
     'instagram', null, 'facebook', null, 'youtube', null, 'tiktok', null
  )),
  ('stats', jsonb_build_object(
     'members', null, 'trainers', null, 'years', null, 'classesPerWeek', null
  )),
  ('footer', jsonb_build_object(
     'about', 'A premium strength & conditioning facility. Elite coaching, pro-grade equipment and small-group classes — built for people who show up.'
  ))
on conflict (key) do nothing;

-- ============================================================================
-- MAKING YOURSELF ADMIN (run once, after creating your Supabase Auth user):
--
--   update public.profiles
--   set role = 'admin'
--   where id = '<YOUR-AUTH-USER-UUID>';
--
-- (Find the UUID under Authentication → Users in the Supabase dashboard.)
-- ============================================================================
