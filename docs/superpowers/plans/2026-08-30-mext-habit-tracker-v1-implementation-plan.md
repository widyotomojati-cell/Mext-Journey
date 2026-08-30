# MEXT Habit Tracker V1 — Implementation Plan

**Date:** 2026-08-30  
**Design baseline:** `docs/superpowers/specs/2026-08-30-mext-habit-tracker-v1-design.md`  
**Delivery target:** Private Next.js PWA backed by Supabase and deployed on Vercel  
**Default repository name:** `mext-habit-tracker`

## Working method

Implementation proceeds as a series of independently verifiable vertical slices. Every milestone ends with a test or visible acceptance check and a Git commit. The first browser preview is opened only after a recognizable, product-specific Today screen compiles successfully; an untouched starter is never presented as progress.

Before installing packages or creating hosted resources, verify the current stable official guidance for Next.js, Supabase, and Vercel. Commit the selected dependency versions and lockfile. Do not expose a Supabase secret/service-role key to browser code or Git.

## Project structure

```text
/
├─ docs/
│  └─ superpowers/
│     ├─ specs/
│     └─ plans/
├─ web/                         # Next.js App Router application
│  ├─ public/
│  ├─ src/
│  │  ├─ app/
│  │  ├─ components/
│  │  ├─ features/
│  │  └─ lib/
│  └─ tests/
├─ supabase/
│  ├─ migrations/
│  └─ seed.sql
├─ web/.env.example
└─ .gitignore
```

The Vercel project uses `web` as its root directory. Supabase migrations stay at the repository root so database history is visible beside application history.

## Milestone 0 — Repository and toolchain foundation

### Task 0.1: Protect private and generated files

Create or update:

- `.gitignore`
- `web/.env.example`

Ignore at minimum:

- `.env*`, while retaining `web/.env.example`.
- `.next/`, `node_modules/`, test artifacts, and local coverage.
- `.superpowers/`, `.artifacts/`, and `.tools/`.
- Local Supabase temporary files.

Acceptance check:

- `git status --short` does not expose local brainstorming artifacts or environment values.
- `web/.env.example` contains names only, never working credentials.

### Task 0.2: Scaffold the application

Create `web/` with the current stable official Next.js App Router scaffold using:

- TypeScript.
- App Router.
- `src/` layout.
- Tailwind CSS.
- ESLint.
- npm and a committed `package-lock.json`.

Add shadcn/ui using the existing Next.js project and install only the primitives needed by the first slice. Do not keep starter branding or placeholder content.

Expected core files:

- `web/package.json`
- `web/package-lock.json`
- `web/next.config.ts`
- `web/tsconfig.json`
- `web/src/app/layout.tsx`
- `web/src/app/page.tsx`
- `web/src/app/globals.css`

Acceptance check:

- `npm run build` succeeds from `web/`.
- The repository contains one package manager and one lockfile for the app.

### Task 0.3: Establish automated checks

Install and configure:

- Vitest and React Testing Library for domain and component tests.
- Playwright for end-to-end browser checks.
- A `typecheck` script using TypeScript without emitting files.

Create:

- `web/vitest.config.ts`
- `web/src/test/setup.ts`
- `web/playwright.config.ts`

Required commands:

- `npm run test`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`

Commit checkpoint: `chore: scaffold tested Next.js application`

## Milestone 1 — First meaningful Today preview

### Task 1.1: Apply the visual system

Create intentional shared tokens in `web/src/app/globals.css` before styling individual features.

Visual direction: **architect's field notebook meets calm habit game**.

- Warm paper background rather than sterile white.
- Deep evergreen as the primary color.
- Restrained terracotta accent for actions and earned stamps.
- Strong, readable sans-serif typography with compact architectural labels.
- Fine grid-line and drafting cues used sparingly for structure.
- Rounded surfaces, but with controlled geometry rather than generic pill-shaped UI everywhere.
- Motion limited to clear state changes and reward feedback, with reduced-motion support.

Define light and dark tokens even if V1 initially defaults to light mode.

### Task 1.2: Build the bounded static product slice

Create:

- `web/src/components/app-shell.tsx`
- `web/src/features/today/components/focused-quest-card.tsx`
- `web/src/features/today/components/progress-summary.tsx`
- `web/src/features/today/fixtures/day-one.ts`
- Update `web/src/app/page.tsx`
- Update site metadata in `web/src/app/layout.tsx`

Render representative Day 1 content:

- Greeting for Dio.
- Sprint theme “Cerita gue punya arah”.
- One dominant 15-minute quest.
- Streak and XP indicators.
- One clear **Start Quest** action.

Do not implement fake navigation or backend behavior in this slice.

### Task 1.3: First preview gate

Run the development server and perform one non-browser request to the exact local URL. Open it in the app only after:

- Compilation succeeds.
- The route returns a non-error response.
- The first viewport clearly looks like Dio's MEXT habit tracker.
- The primary action is visible at 390 px without a marketing hero above it.

This is the first user-facing implementation checkpoint.

Commit checkpoint: `feat: add focused Today quest preview`

## Milestone 2 — Pure habit and calendar domain

Build the rules as framework-independent TypeScript before connecting them to Supabase.

### Task 2.1: Define domain types

Create:

- `web/src/features/quests/domain/types.ts`
- `web/src/features/quests/domain/quest-pack.ts`
- `web/src/features/quests/domain/assignment-status.ts`
- `web/src/features/rewards/domain/types.ts`

Represent:

- Quest types: standard, recovery, optional review.
- Assignment states: available, started, completed, missed.
- Evidence modes: note, URL, file.
- Reward events: XP, weekly badge, Journey Stamp.

### Task 2.2: Implement time and assignment rules test-first

Create:

- `web/src/features/quests/domain/effective-day.ts`
- `web/src/features/quests/domain/next-assignment.ts`
- `web/src/features/quests/domain/effective-day.test.ts`
- `web/src/features/quests/domain/next-assignment.test.ts`

Cover:

- Asia/Jakarta day boundaries.
- Yesterday's active quest remains available until 03:00.
- After 03:00 an incomplete eligible assignment becomes missed.
- A miss creates one Recovery Quest and no backlog.
- Optional review days never create a streak penalty.

### Task 2.3: Implement reward rules test-first

Create:

- `web/src/features/rewards/domain/calculate-streak.ts`
- `web/src/features/rewards/domain/weekly-badge.ts`
- Associated unit tests.

Cover:

- Streak continuation and reset.
- Permanent historical XP and stamps.
- Weekly badge qualification at five of six required quests.
- Duplicate reward events do not change totals.

Acceptance check:

- Unit tests include explicit boundary cases at 02:59 and 03:00 WIB.
- All domain tests pass without a database.

Commit checkpoint: `feat: implement tested habit domain rules`

## Milestone 3 — Supabase database and security

### Task 3.1: Initialize migration history

Create Supabase configuration and a first migration under `supabase/migrations/`.

Tables:

- `profiles`
- `quest_packs`
- `quest_definitions`
- `journey_enrollments`
- `daily_assignments`
- `evidence`
- `reward_ledger`

Important constraints:

- One active enrollment per user and pack version.
- One assignment per user and local assignment date.
- One evidence row per assignment.
- One reward event per assignment and reward type.
- Foreign keys and indexes for every ownership and lookup path.
- Status and evidence-mode checks represented by enums or check constraints.

`journey_enrollments` is the implementation record that anchors Dio to a pack version and a Monday start date. This preserves the approved Monday–Saturday rhythm and Sunday Review. The first production sprint is activated on a Monday; account setup may happen earlier.

### Task 3.2: Add Row Level Security

For every exposed private table:

- Enable RLS.
- Add ownership policies using `(select auth.uid()) = user_id` or an equivalent indexed owner predicate.
- Add both visibility and post-update ownership checks for updates.
- Keep quest definitions readable to authenticated users but writable only through controlled server or migration paths.
- Never make evidence storage public.

Create two-user SQL or integration checks proving cross-user reads and writes fail.

### Task 3.3: Seed the approved quest pack

Create `supabase/seed.sql` containing:

- The versioned 14-day pack.
- Days 1–14 from the approved design.
- The standard Recovery Quest.
- XP and reward identifiers.

Seed content is product content, not personal evidence.

### Task 3.4: Add transactional database functions

Create narrowly scoped functions for:

- Getting or creating the authenticated user's current assignment using server time.
- Starting an assignment.
- Completing an assignment and creating its reward atomically.
- Marking stale assignments missed and selecting Recovery Quest when necessary.

Each function must validate the authenticated owner. Completion must be idempotent: calling it twice returns the existing completion outcome and never adds another reward.

Acceptance check:

- Migrations apply cleanly to a fresh development database.
- Two-user RLS tests pass.
- Duplicate completion tests leave one reward row.
- Supabase security and performance advisors report no unresolved release-blocking issue.

Commit checkpoint: `feat: add secure Supabase habit data model`

## Milestone 4 — Authentication and first-time setup

### Task 4.1: Add Supabase clients safely

Create:

- `web/src/lib/supabase/client.ts`
- `web/src/lib/supabase/server.ts`
- `web/src/proxy.ts` or the current official App Router session-refresh equivalent.
- `web/src/app/auth/callback/route.ts`

Use only public client configuration in browser code. Keep secrets server-side. Follow the current official package and cookie guidance verified on implementation day.

### Task 4.2: Build magic-link sign-in

Create:

- `web/src/app/login/page.tsx`
- `web/src/features/auth/components/magic-link-form.tsx`
- `web/src/features/auth/actions/request-magic-link.ts`

States:

- Ready.
- Sending.
- Email sent.
- Invalid or expired link.
- Retry.

### Task 4.3: Create Dio's profile and enrollment

On first authenticated access:

- Create the profile with nickname `Dio` and timezone `Asia/Jakarta`.
- Create the initial pack enrollment.
- Anchor the official sprint to the next Monday, or the current date when it is Monday.
- Before the start date, show a calm start-date card rather than generating quest debt.

Acceptance check:

- Login redirects to Today.
- The same login works in a second browser/device session.
- Unauthenticated private routes redirect to login.
- No secret value appears in client bundles or committed files.

Commit checkpoint: `feat: add passwordless onboarding`

## Milestone 5 — Live Today Quest vertical slice

### Task 5.1: Load authoritative Today data

Create:

- `web/src/features/today/data/get-today-assignment.ts`
- `web/src/features/today/types.ts`
- `web/src/app/(authenticated)/today/page.tsx`
- Authenticated route layout.

Use a Server Component for the initial Today query. Keep only interaction state in Client Components.

### Task 5.2: Implement start and evidence draft flow

Create:

- `web/src/features/today/components/quest-runner.tsx`
- `web/src/features/today/components/evidence-form.tsx`
- `web/src/features/today/hooks/use-evidence-draft.ts`
- `web/src/features/today/actions/start-quest.ts`

Flow:

1. Start Quest.
2. Reveal compact microsteps and evidence input.
3. Preserve note, URL, and difficulty draft locally under a user-and-assignment-specific key.

### Task 5.3: Complete the note and URL paths

Create a server action that calls the transactional completion function and returns the canonical reward state.

Handle:

- Success.
- Validation errors.
- Offline/network failure.
- Expired session and resume.
- Repeated click or retry.

Remove the local draft only after confirmed backend success.

### Task 5.4: Add reward feedback

Create:

- `web/src/features/rewards/components/completion-reward.tsx`
- `web/src/features/rewards/components/journey-stamp.tsx`

Reward feedback is brief, accessible, and reduced-motion aware. It shows earned XP and any badge/stamp without introducing coins or leaderboards.

Acceptance check:

- Day 1 can be completed end-to-end with a note.
- Refreshing during the flow restores the draft.
- Double-submit produces one completion and one reward.
- A second device sees the completed state.

Commit checkpoint: `feat: complete the live Today quest flow`

## Milestone 6 — Private file evidence

### Task 6.1: Configure private storage policies

Add a private evidence bucket with owner-scoped paths such as:

```text
{auth_user_id}/{assignment_id}/{generated_filename}
```

Add the necessary select, insert, and update permissions for the chosen upload behavior. Never rely on the path alone; policies validate the authenticated owner and matching assignment.

### Task 6.2: Add file upload UI and retry behavior

Create:

- `web/src/features/evidence/components/file-evidence-input.tsx`
- `web/src/features/evidence/data/upload-evidence-file.ts`

Enforce an explicit V1 allowlist and size limit. Generate storage filenames instead of trusting the original filename. Preserve the text draft when upload fails and offer one clear retry action.

Acceptance check:

- A valid file can be uploaded and reopened by Dio.
- User B and anonymous clients receive access denial.
- An interrupted upload does not mark the quest complete or duplicate XP.

Commit checkpoint: `feat: add private file evidence`

## Milestone 7 — Journey, Evidence, and Profile areas

### Task 7.1: Build Journey

Create:

- `web/src/app/(authenticated)/journey/page.tsx`
- `web/src/features/journey/components/sprint-path.tsx`
- `web/src/features/journey/components/weekly-progress.tsx`

Show completed, current, upcoming locked, missed, recovery, and optional review states. Upcoming quests reveal titles for orientation but do not create extra primary actions.

### Task 7.2: Build Evidence archive

Create:

- `web/src/app/(authenticated)/evidence/page.tsx`
- `web/src/features/evidence/components/evidence-list.tsx`
- `web/src/features/evidence/components/evidence-item.tsx`

Group evidence by quest and allow Dio to open private files through short-lived authenticated access. V1 does not become a general file manager.

### Task 7.3: Build Profile and compact navigation

Create:

- `web/src/app/(authenticated)/profile/page.tsx`
- `web/src/components/mobile-navigation.tsx`

Profile supports nickname, timezone display, reminder setup status, and sign-out. Timezone remains fixed to Asia/Jakarta in V1 unless changed through a validated selector.

Acceptance check:

- All four approved areas are reachable with keyboard and touch.
- Today remains the default and visually dominant area.
- No secondary page can alter another user's data.

Commit checkpoint: `feat: add journey evidence and profile views`

## Milestone 8 — PWA, resilience, and Calendar reminder

### Task 8.1: Add installability

Create:

- `web/src/app/manifest.ts`
- Product-specific application icons under `web/public/`.
- The minimal current stable service-worker setup required for installability and cached shell behavior.

The service worker may cache the application shell and last successful Today response. V1 does not queue final quest completion offline.

### Task 8.2: Complete reliability states

Create route-level and component-level states:

- `loading.tsx`.
- `error.tsx`.
- Empty enrollment state.
- Offline read-only state.
- Session-expired state.
- Upload retry state.

Verify drafts remain device-local and are never exposed to another logged-in user on the same browser profile.

### Task 8.3: Add reminder setup

Create a Profile action that generates a Google Calendar-compatible recurring 18:00 WIB reminder for the 14-day sprint. The reminder deep-links to `/today`.

Prefer a standards-based calendar file or documented Google Calendar creation link that requires Dio's final confirmation. Do not request broad Calendar account access for V1.

Acceptance check:

- The application is installable on a supported mobile browser.
- Cached Today content remains readable offline.
- Offline submission clearly waits for reconnection rather than showing false success.
- The Calendar entry displays 18:00 Asia/Jakarta and opens Today.

Commit checkpoint: `feat: add PWA resilience and reminder setup`

## Milestone 9 — Full verification and release

### Task 9.1: Complete automated coverage

Add or finish Playwright flows for:

- Magic-link test authentication strategy.
- Start and complete note evidence.
- Complete URL and file evidence.
- Duplicate completion.
- Missed-to-recovery transition.
- Cross-device synchronized state.
- Cross-user denial.
- Mobile and desktop navigation.

Avoid mocking the rule boundaries that the tests are intended to prove.

### Task 9.2: Accessibility and visual verification

Check:

- 390 px mobile viewport and representative desktop viewport.
- Keyboard-only completion.
- Visible focus.
- Accessible names and status announcements.
- Contrast and tap-target size.
- Reduced-motion mode.

Use the same browser tab from the first meaningful preview for final local verification.

### Task 9.3: Production build and security audit

Run:

- Unit and component tests.
- Typecheck.
- Production build.
- End-to-end tests against the release candidate.
- Supabase security and performance advisors.
- Secret scan of tracked files.

Resolve all release-blocking failures before deployment.

### Task 9.4: Create the private GitHub remote

Create `mext-habit-tracker` as a private repository under Dio's authenticated GitHub account, add it as `origin`, and push `main`. Confirm repository visibility is private before pushing.

Do not include:

- Environment files.
- Evidence.
- Local brainstorming state.
- Generated test or build artifacts.

### Task 9.5: Deploy to Vercel

Create or link the Vercel project with `web` as its root. Configure public Supabase values and server-only secrets in the appropriate Vercel environments, then deploy.

Run a production smoke test:

- Login.
- Today assignment.
- Completion and reward.
- Evidence privacy.
- Cross-device refresh.
- Calendar deep link.

Commit checkpoint: `chore: prepare verified V1 release`

## Definition of done

V1 is done only when:

- The production app satisfies every success criterion in the approved design.
- All automated checks pass.
- Cross-user RLS and storage isolation are explicitly verified.
- Duplicate completion cannot create duplicate rewards.
- The deployed app works on Dio's phone and laptop with synchronized progress.
- The 18:00 WIB Calendar reminder opens Today.
- The source exists in a confirmed private GitHub repository.
- The repository contains no secret or personal evidence.

## First implementation session boundary

The first build session should complete Milestones 0 and 1 only:

1. Repository hygiene.
2. Tested Next.js scaffold.
3. Intentional visual tokens.
4. A recognizable static Today Quest preview.
5. Local browser handoff for Dio's feedback.

This boundary gives Dio something concrete to react to before database and authentication work begins, without presenting a disposable starter as progress.
