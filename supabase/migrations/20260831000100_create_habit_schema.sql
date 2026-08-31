create extension if not exists pgcrypto with schema extensions;

create type public.quest_type as enum (
  'standard',
  'recovery',
  'optional-review'
);

create type public.assignment_status as enum (
  'available',
  'started',
  'completed',
  'missed'
);

create type public.evidence_mode as enum ('note', 'url', 'file');

create type public.reward_event_type as enum (
  'daily-xp',
  'weekly-badge',
  'journey-stamp'
);

create type public.journey_status as enum ('active', 'completed');

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null default 'Dio' check (char_length(nickname) between 1 and 40),
  timezone text not null default 'Asia/Jakarta' check (char_length(timezone) between 1 and 80),
  reminder_enabled boolean not null default false,
  reminder_configured_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quest_packs (
  id uuid primary key default gen_random_uuid(),
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  version integer not null check (version > 0),
  title text not null check (char_length(title) between 1 and 120),
  total_days smallint not null check (total_days between 1 and 60),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (slug, version)
);

create table public.quest_definitions (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.quest_packs (id) on delete cascade,
  day_number smallint,
  quest_type public.quest_type not null,
  theme text not null check (char_length(theme) between 1 and 120),
  title text not null check (char_length(title) between 1 and 160),
  instructions text not null check (char_length(instructions) between 1 and 1200),
  evidence_prompt text not null check (char_length(evidence_prompt) between 1 and 300),
  duration_minutes smallint not null default 15 check (duration_minutes between 1 and 60),
  xp_value integer not null default 20 check (xp_value between 0 and 1000),
  created_at timestamptz not null default now(),
  constraint quest_definition_day_matches_type check (
    (quest_type = 'recovery' and day_number is null)
    or
    (quest_type <> 'recovery' and day_number between 1 and 60)
  )
);

create unique index quest_definitions_pack_day_unique
  on public.quest_definitions (pack_id, day_number)
  where day_number is not null;

create unique index quest_definitions_one_recovery_per_pack
  on public.quest_definitions (pack_id)
  where quest_type = 'recovery';

create index quest_definitions_pack_id_idx
  on public.quest_definitions (pack_id);

create table public.journey_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  pack_id uuid not null references public.quest_packs (id) on delete restrict,
  start_date date not null,
  status public.journey_status not null default 'active',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journey_starts_on_monday check (extract(isodow from start_date) = 1),
  constraint journey_completion_matches_status check (
    (status = 'active' and completed_at is null)
    or
    (status = 'completed' and completed_at is not null)
  ),
  unique (user_id, pack_id)
);

create index journey_enrollments_user_id_idx
  on public.journey_enrollments (user_id);

create unique index journey_enrollments_one_active_per_user
  on public.journey_enrollments (user_id)
  where status = 'active';

create table public.daily_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  enrollment_id uuid not null references public.journey_enrollments (id) on delete cascade,
  quest_definition_id uuid not null references public.quest_definitions (id) on delete restrict,
  assignment_date date not null,
  status public.assignment_status not null default 'available',
  started_at timestamptz,
  completed_at timestamptz,
  cutoff_at timestamptz not null,
  recovery_for_assignment_id uuid references public.daily_assignments (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assignment_started_matches_status check (
    status in ('available', 'missed') or started_at is not null
  ),
  constraint assignment_completed_matches_status check (
    (status = 'completed' and completed_at is not null)
    or
    (status <> 'completed' and completed_at is null)
  ),
  unique (user_id, assignment_date)
);

create index daily_assignments_user_id_idx
  on public.daily_assignments (user_id);

create index daily_assignments_enrollment_id_idx
  on public.daily_assignments (enrollment_id);

create index daily_assignments_quest_definition_id_idx
  on public.daily_assignments (quest_definition_id);

create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  assignment_id uuid not null references public.daily_assignments (id) on delete cascade,
  mode public.evidence_mode not null,
  note_text text,
  source_url text,
  storage_path text,
  difficulty smallint check (difficulty between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint evidence_matches_selected_mode check (
    (
      mode = 'note'
      and nullif(btrim(note_text), '') is not null
      and source_url is null
      and storage_path is null
    )
    or
    (
      mode = 'url'
      and note_text is null
      and nullif(btrim(source_url), '') is not null
      and storage_path is null
    )
    or
    (
      mode = 'file'
      and note_text is null
      and source_url is null
      and nullif(btrim(storage_path), '') is not null
    )
  ),
  unique (assignment_id)
);

create index evidence_user_id_idx on public.evidence (user_id);

create table public.reward_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  assignment_id uuid not null references public.daily_assignments (id) on delete cascade,
  event_type public.reward_event_type not null,
  xp integer not null default 0 check (xp >= 0),
  reward_key text,
  created_at timestamptz not null default now(),
  unique (assignment_id, event_type)
);

create index reward_ledger_user_id_idx on public.reward_ledger (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger journey_enrollments_set_updated_at
before update on public.journey_enrollments
for each row execute function public.set_updated_at();

create trigger daily_assignments_set_updated_at
before update on public.daily_assignments
for each row execute function public.set_updated_at();

create trigger evidence_set_updated_at
before update on public.evidence
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, nickname, timezone)
  values (new.id, 'Dio', 'Asia/Jakarta')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

alter table public.profiles enable row level security;
alter table public.quest_packs enable row level security;
alter table public.quest_definitions enable row level security;
alter table public.journey_enrollments enable row level security;
alter table public.daily_assignments enable row level security;
alter table public.evidence enable row level security;
alter table public.reward_ledger enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.quest_packs from anon, authenticated;
revoke all on table public.quest_definitions from anon, authenticated;
revoke all on table public.journey_enrollments from anon, authenticated;
revoke all on table public.daily_assignments from anon, authenticated;
revoke all on table public.evidence from anon, authenticated;
revoke all on table public.reward_ledger from anon, authenticated;

grant usage on schema public to authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select on table public.quest_packs to authenticated;
grant select on table public.quest_definitions to authenticated;
grant select, insert, update on table public.journey_enrollments to authenticated;
grant select on table public.daily_assignments to authenticated;
grant select, insert, update on table public.evidence to authenticated;
grant select on table public.reward_ledger to authenticated;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "quest_packs_select_authenticated"
on public.quest_packs for select
to authenticated
using (true);

create policy "quest_definitions_select_authenticated"
on public.quest_definitions for select
to authenticated
using (true);

create policy "journey_enrollments_select_own"
on public.journey_enrollments for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "journey_enrollments_insert_own"
on public.journey_enrollments for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.quest_packs
    where quest_packs.id = journey_enrollments.pack_id
      and quest_packs.is_active
  )
);

create policy "journey_enrollments_update_own"
on public.journey_enrollments for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "daily_assignments_select_own"
on public.daily_assignments for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "evidence_select_own"
on public.evidence for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "evidence_insert_own"
on public.evidence for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.daily_assignments
    where daily_assignments.id = evidence.assignment_id
      and daily_assignments.user_id = (select auth.uid())
  )
);

create policy "evidence_update_own"
on public.evidence for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.daily_assignments
    where daily_assignments.id = evidence.assignment_id
      and daily_assignments.user_id = (select auth.uid())
  )
);

create policy "reward_ledger_select_own"
on public.reward_ledger for select
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.effective_quest_date(
  p_now timestamptz default now(),
  p_timezone text default 'Asia/Jakarta'
)
returns date
language sql
stable
set search_path = ''
as $$
  select case
    when (p_now at time zone p_timezone)::time < time '03:00'
      then (p_now at time zone p_timezone)::date - 1
    else (p_now at time zone p_timezone)::date
  end;
$$;

create or replace function public.get_or_create_today_assignment()
returns setof public.daily_assignments
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_timezone text;
  v_effective_date date;
  v_enrollment public.journey_enrollments%rowtype;
  v_previous public.daily_assignments%rowtype;
  v_previous_type public.quest_type;
  v_quest public.quest_definitions%rowtype;
  v_recovery_for uuid;
  v_day_number integer;
  v_cutoff_at timestamptz;
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select profiles.timezone
  into v_timezone
  from public.profiles
  where profiles.user_id = v_user_id;

  v_timezone := coalesce(v_timezone, 'Asia/Jakarta');
  v_effective_date := public.effective_quest_date(now(), v_timezone);

  select journey_enrollments.*
  into v_enrollment
  from public.journey_enrollments
  where journey_enrollments.user_id = v_user_id
    and journey_enrollments.status = 'active'
    and journey_enrollments.start_date <= v_effective_date
  order by journey_enrollments.created_at desc
  limit 1;

  if not found then
    return;
  end if;

  select daily_assignments.*
  into v_previous
  from public.daily_assignments
  where daily_assignments.user_id = v_user_id
    and daily_assignments.assignment_date <= v_effective_date
  order by daily_assignments.assignment_date desc
  limit 1
  for update;

  if found and v_previous.assignment_date = v_effective_date then
    return query
    select daily_assignments.*
    from public.daily_assignments
    where daily_assignments.id = v_previous.id;
    return;
  end if;

  if found and v_previous.status <> 'completed' then
    select quest_definitions.quest_type
    into v_previous_type
    from public.quest_definitions
    where quest_definitions.id = v_previous.quest_definition_id;

    update public.daily_assignments
    set status = 'missed'
    where daily_assignments.id = v_previous.id
      and daily_assignments.status <> 'completed';

    if v_previous_type <> 'optional-review' then
      v_recovery_for := v_previous.id;
    end if;
  end if;

  v_day_number := v_effective_date - v_enrollment.start_date + 1;

  if v_recovery_for is not null then
    select quest_definitions.*
    into v_quest
    from public.quest_definitions
    where quest_definitions.pack_id = v_enrollment.pack_id
      and quest_definitions.quest_type = 'recovery'
    limit 1;
  else
    select quest_definitions.*
    into v_quest
    from public.quest_definitions
    where quest_definitions.pack_id = v_enrollment.pack_id
      and quest_definitions.day_number = v_day_number
    limit 1;
  end if;

  if not found then
    if v_day_number > (
      select quest_packs.total_days
      from public.quest_packs
      where quest_packs.id = v_enrollment.pack_id
    ) then
      update public.journey_enrollments
      set status = 'completed', completed_at = now()
      where journey_enrollments.id = v_enrollment.id;
    end if;
    return;
  end if;

  v_cutoff_at := (
    (v_effective_date + 1) + time '03:00'
  ) at time zone v_timezone;

  insert into public.daily_assignments (
    user_id,
    enrollment_id,
    quest_definition_id,
    assignment_date,
    cutoff_at,
    recovery_for_assignment_id
  )
  values (
    v_user_id,
    v_enrollment.id,
    v_quest.id,
    v_effective_date,
    v_cutoff_at,
    v_recovery_for
  )
  on conflict (user_id, assignment_date) do nothing;

  return query
  select daily_assignments.*
  from public.daily_assignments
  where daily_assignments.user_id = v_user_id
    and daily_assignments.assignment_date = v_effective_date;
end;
$$;

create or replace function public.start_daily_assignment(p_assignment_id uuid)
returns setof public.daily_assignments
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  return query
  update public.daily_assignments
  set
    status = 'started',
    started_at = coalesce(daily_assignments.started_at, now())
  where daily_assignments.id = p_assignment_id
    and daily_assignments.user_id = v_user_id
    and daily_assignments.status = 'available'
    and daily_assignments.cutoff_at > now()
  returning daily_assignments.*;

  if not found then
    return query
    select daily_assignments.*
    from public.daily_assignments
    where daily_assignments.id = p_assignment_id
      and daily_assignments.user_id = v_user_id
      and daily_assignments.status in ('started', 'completed');
  end if;
end;
$$;

create or replace function public.complete_daily_assignment(
  p_assignment_id uuid,
  p_mode public.evidence_mode,
  p_note_text text default null,
  p_source_url text default null,
  p_storage_path text default null,
  p_difficulty smallint default null
)
returns table (
  assignment_id uuid,
  assignment_status public.assignment_status,
  xp_awarded integer,
  total_xp bigint
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_assignment public.daily_assignments%rowtype;
  v_xp integer;
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select daily_assignments.*
  into v_assignment
  from public.daily_assignments
  where daily_assignments.id = p_assignment_id
    and daily_assignments.user_id = v_user_id
  for update;

  if not found then
    raise exception 'assignment not found' using errcode = 'P0002';
  end if;

  select quest_definitions.xp_value
  into v_xp
  from public.quest_definitions
  where quest_definitions.id = v_assignment.quest_definition_id;

  if v_assignment.status = 'completed' then
    return query
    select
      v_assignment.id,
      v_assignment.status,
      coalesce(reward_ledger.xp, 0),
      (
        select coalesce(sum(all_rewards.xp), 0)
        from public.reward_ledger as all_rewards
        where all_rewards.user_id = v_user_id
      )::bigint
    from public.reward_ledger
    where reward_ledger.assignment_id = v_assignment.id
      and reward_ledger.event_type = 'daily-xp';
    return;
  end if;

  if v_assignment.status = 'missed' or v_assignment.cutoff_at <= now() then
    raise exception 'assignment is no longer completable' using errcode = '22023';
  end if;

  insert into public.evidence (
    user_id,
    assignment_id,
    mode,
    note_text,
    source_url,
    storage_path,
    difficulty
  )
  values (
    v_user_id,
    v_assignment.id,
    p_mode,
    p_note_text,
    p_source_url,
    p_storage_path,
    p_difficulty
  )
  on conflict on constraint evidence_assignment_id_key do update
  set
    mode = excluded.mode,
    note_text = excluded.note_text,
    source_url = excluded.source_url,
    storage_path = excluded.storage_path,
    difficulty = excluded.difficulty;

  update public.daily_assignments
  set
    status = 'completed',
    started_at = coalesce(daily_assignments.started_at, now()),
    completed_at = now()
  where daily_assignments.id = v_assignment.id
  returning daily_assignments.* into v_assignment;

  insert into public.reward_ledger (
    user_id,
    assignment_id,
    event_type,
    xp,
    reward_key
  )
  values (
    v_user_id,
    v_assignment.id,
    'daily-xp',
    v_xp,
    'daily-xp'
  )
  on conflict on constraint reward_ledger_assignment_id_event_type_key do nothing;

  return query
  select
    v_assignment.id,
    v_assignment.status,
    coalesce(reward_ledger.xp, 0),
    (
      select coalesce(sum(all_rewards.xp), 0)
      from public.reward_ledger as all_rewards
      where all_rewards.user_id = v_user_id
    )::bigint
  from public.reward_ledger
  where reward_ledger.assignment_id = v_assignment.id
    and reward_ledger.event_type = 'daily-xp';
end;
$$;

revoke execute on function public.effective_quest_date(timestamptz, text)
  from public, anon;
revoke execute on function public.get_or_create_today_assignment()
  from public, anon;
revoke execute on function public.start_daily_assignment(uuid)
  from public, anon;
revoke execute on function public.complete_daily_assignment(
  uuid,
  public.evidence_mode,
  text,
  text,
  text,
  smallint
) from public, anon;

grant execute on function public.effective_quest_date(timestamptz, text)
  to authenticated;
grant execute on function public.get_or_create_today_assignment()
  to authenticated;
grant execute on function public.start_daily_assignment(uuid)
  to authenticated;
grant execute on function public.complete_daily_assignment(
  uuid,
  public.evidence_mode,
  text,
  text,
  text,
  smallint
) to authenticated;
