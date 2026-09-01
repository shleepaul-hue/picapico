-- PicaPico initial schema
-- Auth (email/provider/provider_id/agreement timestamp) is handled by Supabase's
-- built-in auth.users table via Google/Apple OAuth — this file only adds the
-- app-specific tables that hang off auth.users.

-- 1) Per-user profile & onboarding data (destination, trip date, reminder time)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  destination text,               -- e.g. "발리, 인도네시아"
  trip_date date,                 -- e.g. 2026-10-15
  reminder_enabled boolean not null default true,
  reminder_time time not null default '08:00',
  terms_agreed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) One row per completed learning session (drives streaks, the Complete
--    screen's stats, and the Archive list/heatmap)
create table if not exists public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_date date not null default current_date,
  duration_seconds integer not null default 0,
  category text,                  -- e.g. "스몰토크" | "인사"
  completed_at timestamptz not null default now()
);
create index if not exists learning_sessions_user_date_idx
  on public.learning_sessions (user_id, session_date desc);

-- 3) Individual phrases learned within a session (Spanish text, translation,
--    audio for the "발음 듣기" button, favorite flag for Archive filtering)
create table if not exists public.phrases (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.learning_sessions (id) on delete cascade,
  spanish_text text not null,
  korean_translation text not null,
  audio_url text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists phrases_session_idx on public.phrases (session_id);

-- Row Level Security: users can only see/edit their own data
alter table public.profiles enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.phrases enable row level security;

create policy "profiles: owner read/write" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "learning_sessions: owner read/write" on public.learning_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "phrases: owner read/write via session" on public.phrases
  for all using (
    exists (
      select 1 from public.learning_sessions s
      where s.id = phrases.session_id and s.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.learning_sessions s
      where s.id = phrases.session_id and s.user_id = auth.uid()
    )
  );

-- Auto-create a public.profiles row whenever a new auth.users row appears
-- (i.e. right after a Google/Apple OAuth sign-in creates the account).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
