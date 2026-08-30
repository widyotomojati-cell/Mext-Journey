begin;

select plan(15);

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
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'dio-owner@example.test',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now()
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'other-user@example.test',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now()
  );

insert into public.journey_enrollments (id, user_id, pack_id, start_date)
values
  (
    'aaaaaaaa-0000-4000-8000-000000000001',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '00000000-0000-4000-8000-000000000001',
    date '2026-08-31'
  ),
  (
    'bbbbbbbb-0000-4000-8000-000000000001',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
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
values
  (
    'aaaaaaaa-1000-4000-8000-000000000001',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'aaaaaaaa-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    date '2026-08-31',
    now() + interval '1 day'
  ),
  (
    'bbbbbbbb-1000-4000-8000-000000000001',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'bbbbbbbb-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    date '2026-08-31',
    now() + interval '1 day'
  );

insert into public.evidence (user_id, assignment_id, mode, note_text)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'aaaaaaaa-1000-4000-8000-000000000001',
    'note',
    'Owner evidence'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'bbbbbbbb-1000-4000-8000-000000000001',
    'note',
    'Other evidence'
  );

insert into public.reward_ledger (user_id, assignment_id, event_type, xp, reward_key)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'aaaaaaaa-1000-4000-8000-000000000001',
    'daily-xp',
    20,
    'daily-xp'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'bbbbbbbb-1000-4000-8000-000000000001',
    'daily-xp',
    20,
    'daily-xp'
  );

select set_config(
  'request.jwt.claims',
  '{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","role":"authenticated"}',
  true
);
set local role authenticated;

select is((select count(*) from public.profiles), 1::bigint, 'owner sees one profile');
select is((select count(*) from public.journey_enrollments), 1::bigint, 'owner sees one enrollment');
select is((select count(*) from public.daily_assignments), 1::bigint, 'owner sees one assignment');
select is((select count(*) from public.evidence), 1::bigint, 'owner sees one evidence row');
select is((select count(*) from public.reward_ledger), 1::bigint, 'owner sees one reward row');
select is((select count(*) from public.quest_packs), 1::bigint, 'authenticated user sees the quest pack');
select is((select count(*) from public.quest_definitions), 15::bigint, 'authenticated user sees all quest definitions');

select lives_ok(
  $$ update public.profiles set nickname = 'Dio Test' where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' $$,
  'owner can update their own profile'
);

update public.profiles
set nickname = 'Leaked update'
where user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

set local role postgres;
select is(
  (select nickname from public.profiles where user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
  'Dio',
  'owner cannot update another profile'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","role":"authenticated"}',
  true
);
set local role authenticated;

select throws_ok(
  $$
    insert into public.journey_enrollments (user_id, pack_id, start_date)
    values (
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      '00000000-0000-4000-8000-000000000001',
      date '2026-09-07'
    )
  $$,
  'owner cannot create another user enrollment'
);

select throws_ok(
  $$
    insert into public.evidence (user_id, assignment_id, mode, note_text)
    values (
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'bbbbbbbb-1000-4000-8000-000000000001',
      'note',
      'Cross-user evidence'
    )
  $$,
  'owner cannot attach evidence to another assignment'
);

select throws_ok(
  $$
    insert into public.daily_assignments (
      user_id,
      enrollment_id,
      quest_definition_id,
      assignment_date,
      cutoff_at
    )
    values (
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'aaaaaaaa-0000-4000-8000-000000000001',
      '10000000-0000-4000-8000-000000000002',
      date '2026-09-01',
      now() + interval '1 day'
    )
  $$,
  'direct assignment insertion is denied'
);

select throws_ok(
  $$
    insert into public.reward_ledger (user_id, assignment_id, event_type, xp)
    values (
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'aaaaaaaa-1000-4000-8000-000000000001',
      'weekly-badge',
      0
    )
  $$,
  'direct reward insertion is denied'
);

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select throws_ok(
  $$ select * from public.profiles $$,
  'anonymous profile access is denied by grants'
);

select throws_ok(
  $$ select * from public.quest_packs $$,
  'anonymous quest content access is denied by grants'
);

select * from finish();
rollback;
