-- Extension needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- Parents are managed by Supabase Auth and extended with this profile table.
create table if not exists profiles_parent (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references profiles_parent(id) on delete cascade,
  name text not null,
  age int check (age between 5 and 7),
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references child_profiles(id) on delete cascade,
  title text,
  theme text,
  content jsonb not null,
  ai_feedback jsonb,
  is_curated boolean default false,
  created_at timestamptz default now()
);

create table if not exists tracing_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references child_profiles(id) on delete cascade,
  letter text not null,
  accuracy numeric,
  attempts int default 0,
  completed_at timestamptz
);

create table if not exists vocabulary_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references child_profiles(id) on delete cascade,
  word text not null,
  pronunciation_score numeric,
  attempts int default 0,
  last_practiced_at timestamptz
);

create table if not exists comprehension_results (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references child_profiles(id) on delete cascade,
  story_id uuid references stories(id) on delete cascade,
  score numeric,
  answers jsonb,
  completed_at timestamptz default now()
);

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references child_profiles(id) on delete cascade,
  badge_key text not null,
  earned_at timestamptz default now()
);

-- Row Level Security: lock every table to its owning parent/child.
alter table profiles_parent enable row level security;
alter table child_profiles enable row level security;
alter table stories enable row level security;
alter table tracing_progress enable row level security;
alter table vocabulary_progress enable row level security;
alter table comprehension_results enable row level security;
alter table achievements enable row level security;

create policy "parents manage own profile" on profiles_parent
  for all using (auth.uid() = id);

create policy "parents manage own children" on child_profiles
  for all using (auth.uid() = parent_id);

create policy "parents manage own children's stories" on stories
  for all using (
    child_id in (select id from child_profiles where parent_id = auth.uid())
  );

create policy "parents manage own children's tracing progress" on tracing_progress
  for all using (
    child_id in (select id from child_profiles where parent_id = auth.uid())
  );

create policy "parents manage own children's vocabulary progress" on vocabulary_progress
  for all using (
    child_id in (select id from child_profiles where parent_id = auth.uid())
  );

create policy "parents manage own children's comprehension results" on comprehension_results
  for all using (
    child_id in (select id from child_profiles where parent_id = auth.uid())
  );

create policy "parents manage own children's achievements" on achievements
  for all using (
    child_id in (select id from child_profiles where parent_id = auth.uid())
  );
