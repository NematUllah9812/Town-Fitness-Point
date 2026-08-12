-- ============================================================================
-- Town Fitness Point — 0001_schema.sql
-- Initial schema, RLS policies, storage bucket.
--
-- Run in the Supabase SQL editor (or `supabase db push`).
-- All tables: Row Level Security ENABLED. Default = deny.
-- Public can ONLY: read active/published content, insert into submission
-- tables. Admin CRUD is enforced by RLS policies + server-side checks.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- 1. Admin helper (security definer → no recursive policy problem)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Profiles (mirrors auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  role       text not null default 'member' check (role in ('admin','member')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row when a Supabase Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

-- Users may read their own profile only; admins manage all profiles.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_admin_all"
  on public.profiles for all
  using (is_admin())
  with check (is_admin());

-- ---------------------------------------------------------------------------
-- 3. Content tables (public read = active/published only; admin = all)
-- ---------------------------------------------------------------------------

create table public.classes (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  category        text not null check (category in ('strength','cardio','combat','mind_body','functional')),
  difficulty      text not null check (difficulty in ('beginner','intermediate','advanced')),
  description     text not null default '',
  duration_min    int not null default 60 check (duration_min between 10 and 240),
  calorie_burn_est int,
  image_url       text,
  featured        boolean not null default false,
  active          boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.trainers (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  specialty        text not null default '',
  bio              text not null default '',
  certifications   text[] not null default '{}',
  experience_years int,
  photo_url        text,
  socials          jsonb not null default '{}'::jsonb,
  featured         boolean not null default false,
  active           boolean not null default true,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.membership_plans (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  price_pkr  numeric(10,2),  -- null = "Contact us" until owner sets real prices
  period     text not null default 'monthly' check (period in ('monthly','quarterly','yearly')),
  tagline    text not null default '',
  features   text[] not null default '{}',
  popular    boolean not null default false,
  active     boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.schedule (
  id         uuid primary key default gen_random_uuid(),
  class_id   uuid not null references public.classes(id) on delete cascade,
  trainer_id uuid references public.trainers(id) on delete set null,
  weekday    smallint not null check (weekday between 0 and 6),  -- 0=Mon … 6=Sun
  start_time time not null,
  end_time   time not null,
  capacity   int,
  room       text,
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table public.testimonials (
  id             uuid primary key default gen_random_uuid(),
  member_name    text not null,
  role           text,
  photo_url      text,
  rating         smallint not null default 5 check (rating between 1 and 5),
  quote          text not null,
  result_summary text,
  published      boolean not null default false,
  featured       boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  excerpt          text not null default '',
  content          text not null default '',
  cover_image_url  text,
  category         text,
  author_name      text,
  published        boolean not null default false,
  published_at     timestamptz,
  seo_title        text,
  seo_description  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.gallery_items (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  caption    text,
  category   text not null check (category in ('facility','classes','equipment','community')),
  sort_order int not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. Submission tables (public: INSERT only; admin: read + status updates)
-- ---------------------------------------------------------------------------

create table public.free_trial_requests (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  email              text not null,
  phone              text not null,
  preferred_class_id uuid references public.classes(id) on delete set null,
  notes              text not null default '',
  status             text not null default 'new'
                     check (status in ('new','contacted','booked','converted','cancelled')),
  source             text not null default 'website',
  created_at         timestamptz not null default now()
);

create table public.membership_inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text not null,
  plan_id    uuid references public.membership_plans(id) on delete set null,
  message    text not null default '',
  status     text not null default 'new'
             check (status in ('new','contacted','booked','converted','cancelled')),
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text not null default '',
  subject    text not null,
  message    text not null,
  status     text not null default 'new'
             check (status in ('new','contacted','resolved','cancelled')),
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  email      text primary key,
  source     text not null default 'footer',
  subscribed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. Rate limiting (server-only table; NO public policies at all)
-- ---------------------------------------------------------------------------
create table public.rate_limits (
  scope        text not null,           -- e.g. 'trial', 'newsletter', 'contact'
  key          text not null,           -- e.g. 'ip:1.2.3.4' or 'email:user@x.com'
  window_start timestamptz not null,
  count        int not null default 0,
  primary key (scope, key, window_start)
);

-- ---------------------------------------------------------------------------
-- 6. Site settings (admin-editable business facts)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  key        text primary key,          -- 'business' | 'contact' | 'hours' | 'socials' | 'stats' | 'footer'
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- Public-safe view: settings contain no secrets, but exposing them only
-- through a view keeps the raw table fully locked to anonymous users.
create or replace view public.site_settings_public as
  select key, value from public.site_settings;

alter table public.site_settings enable row level security;

-- ---------------------------------------------------------------------------
-- 7. RLS POLICIES
-- ---------------------------------------------------------------------------

-- --- classes: anon may read active rows; admin full CRUD ---
alter table public.classes enable row level security;
create policy "classes_public_read_active"
  on public.classes for select using (active = true);
create policy "classes_admin_all"
  on public.classes for all using (is_admin()) with check (is_admin());

-- --- trainers ---
alter table public.trainers enable row level security;
create policy "trainers_public_read_active"
  on public.trainers for select using (active = true);
create policy "trainers_admin_all"
  on public.trainers for all using (is_admin()) with check (is_admin());

-- --- membership_plans ---
alter table public.membership_plans enable row level security;
create policy "plans_public_read_active"
  on public.membership_plans for select using (active = true);
create policy "plans_admin_all"
  on public.membership_plans for all using (is_admin()) with check (is_admin());

-- --- schedule ---
alter table public.schedule enable row level security;
create policy "schedule_public_read_active"
  on public.schedule for select using (active = true);
create policy "schedule_admin_all"
  on public.schedule for all using (is_admin()) with check (is_admin());

-- --- testimonials: only PUBLISHED rows are public ---
alter table public.testimonials enable row level security;
create policy "testimonials_public_read_published"
  on public.testimonials for select using (published = true);
create policy "testimonials_admin_all"
  on public.testimonials for all using (is_admin()) with check (is_admin());

-- --- blog_posts ---
alter table public.blog_posts enable row level security;
create policy "blog_public_read_published"
  on public.blog_posts for select using (published = true);
create policy "blog_admin_all"
  on public.blog_posts for all using (is_admin()) with check (is_admin());

-- --- gallery_items ---
alter table public.gallery_items enable row level security;
create policy "gallery_public_read_active"
  on public.gallery_items for select using (active = true);
create policy "gallery_admin_all"
  on public.gallery_items for all using (is_admin()) with check (is_admin());

-- --- site_settings: anon gets the view only; admin manages the table ---
create policy "settings_admin_all"
  on public.site_settings for all using (is_admin()) with check (is_admin());
grant select on public.site_settings_public to anon, authenticated;

-- --- free_trial_requests: INSERT only for everyone; admin read/update ---
alter table public.free_trial_requests enable row level security;
create policy "trials_public_insert"
  on public.free_trial_requests for insert
  with check (true);
create policy "trials_admin_select"
  on public.free_trial_requests for select using (is_admin());
create policy "trials_admin_update"
  on public.free_trial_requests for update using (is_admin()) with check (is_admin());
-- NOTE: no delete policy — submissions are archived, never destroyed.

-- --- membership_inquiries ---
alter table public.membership_inquiries enable row level security;
create policy "inquiries_public_insert"
  on public.membership_inquiries for insert
  with check (true);
create policy "inquiries_admin_select"
  on public.membership_inquiries for select using (is_admin());
create policy "inquiries_admin_update"
  on public.membership_inquiries for update using (is_admin()) with check (is_admin());

-- --- contact_messages ---
alter table public.contact_messages enable row level security;
create policy "messages_public_insert"
  on public.contact_messages for insert
  with check (true);
create policy "messages_admin_select"
  on public.contact_messages for select using (is_admin());
create policy "messages_admin_update"
  on public.contact_messages for update using (is_admin()) with check (is_admin());

-- --- newsletter_subscribers: public may subscribe (insert/upsert on email) ---
alter table public.newsletter_subscribers enable row level security;
create policy "subscribers_public_insert"
  on public.newsletter_subscribers for insert
  with check (true);
-- NO public UPDATE/DELETE policies: unsubscribes are handled server-side
-- by a signed-token flow (app/api/unsubscribe), verified with the service
-- client. The anon key can never modify or read existing rows.
create policy "subscribers_admin_select"
  on public.newsletter_subscribers for select using (is_admin());
create policy "subscribers_admin_update"
  on public.newsletter_subscribers for update using (is_admin()) with check (is_admin());

-- --- rate_limits: NO policies — anonymous users can never read or write
--     it directly. The server (service role) is the only writer. ---
alter table public.rate_limits enable row level security;

-- ---------------------------------------------------------------------------
-- 8. updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger classes_set_updated_at before update on public.classes
  for each row execute function public.set_updated_at();
create trigger trainers_set_updated_at before update on public.trainers
  for each row execute function public.set_updated_at();
create trigger plans_set_updated_at before update on public.membership_plans
  for each row execute function public.set_updated_at();
create trigger schedule_set_updated_at before update on public.schedule
  for each row execute function public.set_updated_at();
create trigger testimonials_set_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();
create trigger blog_set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();
create trigger subscribers_set_updated_at before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();
create trigger settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 9. Storage bucket for real photos (public read, admin write)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_public_read"
  on storage.objects for select
  using (bucket_id = 'media');
create policy "media_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and is_admin());
create policy "media_admin_update"
  on storage.objects for update
  using (bucket_id = 'media' and is_admin());
create policy "media_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and is_admin());

-- ---------------------------------------------------------------------------
-- 10. Indexes
-- ---------------------------------------------------------------------------
create index idx_schedule_weekday     on public.schedule (weekday, start_time);
create index idx_schedule_class       on public.schedule (class_id);
create index idx_schedule_trainer     on public.schedule (trainer_id);
create index idx_classes_category     on public.classes (category) where active;
create index idx_trainers_featured    on public.trainers (sort_order) where active;
create index idx_plans_sort           on public.membership_plans (sort_order) where active;
create index idx_blog_published       on public.blog_posts (published_at desc) where published;
create index idx_gallery_sort         on public.gallery_items (sort_order) where active;
create index idx_trials_status        on public.free_trial_requests (status, created_at desc);
create index idx_inquiries_status     on public.membership_inquiries (status, created_at desc);
create index idx_messages_status      on public.contact_messages (status, created_at desc);
create index idx_rate_limits_window   on public.rate_limits (scope, key, window_start desc);
