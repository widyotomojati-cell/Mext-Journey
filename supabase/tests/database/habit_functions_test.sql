begin;

select plan(5);

select is(
  public.effective_quest_date(
    timestamptz '2026-08-30 19:59:00+00',
    'Asia/Jakarta'
  ),
  date '2026-08-30',
  '02:59 WIB remains in the previous quest day'
);

select is(
  public.effective_quest_date(
    timestamptz '2026-08-30 20:00:00+00',
    'Asia/Jakarta'
  ),
  date '2026-08-31',
  '03:00 WIB opens the next quest day'
);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'completion-test@example.test',
  '',
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
);

insert into public.journey_enrollments (id, user_id, pack_id, start_date)
values (
  'cccccccc-0000-4000-8000-000000000001',
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '00000000-0000-4000-8000-000000000001',
  date '2026-08-31'
);

insert into public.daily_assignments (
  id,
  user_id,
  enrollment_id,
  quest_definition_id,
  assignment_date,
  cutoff_at
)
values (
  'cccccccc-1000-4000-8000-000000000001',
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'cccccccc-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  date '2026-08-31',
  now() + interval '1 day'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"cccccccc-cccc-4ccc-8ccc-cccccccccccc","role":"authenticated"}',
  true
);
set local role authenticated;

select results_eq(
  $$
    select xp_awarded
    from public.complete_daily_assignment(
      'cccccccc-1000-4000-8000-000000000001',
      'note',
      'MEXT matters now because waiting has become its own risk.'
    )
  $$,
  $$ values (20) $$,
  'first completion awards the quest XP'
);

select results_eq(
  $$
    select xp_awarded
    from public.complete_daily_assignment(
      'cccccccc-1000-4000-8000-000000000001',
      'note',
      'This retry must not replace the accepted evidence.'
    )
  $$,
  $$ values (20) $$,
  'completion retry returns the existing reward'
);

set local role postgres;
select is(
  (
    select count(*)
    from public.reward_ledger
    where assignment_id = 'cccccccc-1000-4000-8000-000000000001'
      and event_type = 'daily-xp'
  ),
  1::bigint,
  'completion retry creates only one reward row'
);

select * from finish();
rollback;
