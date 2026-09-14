-- Applied in Supabase on 2026-09-14
-- Stores optional mentor feedback and enables the Level 2 quest buffer.
alter table public.quest_packs add column if not exists is_flexible boolean not null default false;
update public.quest_packs set is_flexible=true where slug='research-roadmap-sprint' and version=1;

create table if not exists public.mentor_reviews (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 assignment_id uuid not null references public.daily_assignments(id) on delete cascade,
 answer_snapshot text not null check (char_length(answer_snapshot) between 3 and 4000),
 verdict text not null check (verdict in ('strong','refine')),
 strengths jsonb not null default '[]'::jsonb,
 focus_area text not null, suggestion text not null, follow_up_question text,
 model text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(assignment_id)
);
create table if not exists public.mentor_review_events (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 assignment_id uuid not null references public.daily_assignments(id) on delete cascade, created_at timestamptz not null default now()
);
-- See Supabase migration history for the full security policies and revised assignment RPCs.