# MEXT Habit Tracker V1 — Product Design

**Date:** 2026-08-30  
**Status:** Ready for user review  
**Owner:** Dio  
**Primary objective:** Establish a sustainable 15-minute daily habit for Dio's Japanese master's and scholarship preparation.

## 1. Context

Dio is an architectural designer born on 19 July 1994, graduated in Architecture in 2016 with a GPA of 3.34, and has approximately nine years of professional experience. During the last six years, most of his work has involved landed houses in Jabodetabek.

His primary academic direction is evidence-based passive design for thermal comfort and reduced cooling dependency in hot-humid landed housing, with resilient architecture as a secondary direction. His long-term target is admission to a relevant Japanese university and a MEXT scholarship through either Embassy Recommendation or University Recommendation. Other scholarships remain acceptable when they serve the same study objective.

The immediate constraint is not lack of information. The preparation feels too large, which creates avoidance and inconsistent action. V1 therefore optimizes for showing up consistently, not for completing the application as quickly as possible.

Any age limit, schedule, eligibility rule, or document requirement used later must be reverified against the current official MEXT, Embassy of Japan in Indonesia, and target-university sources. The application should be treated as time-sensitive, but the product must not present an unverified deadline as authoritative.

## 2. Product principles

1. **One small action beats a complete master plan.** The home screen prioritizes one quest that can be attempted in 15 minutes.
2. **No shame debt.** Missing a day never creates a backlog. The next available day begins with a lighter Recovery Quest.
3. **Progress must produce useful artifacts.** Evidence gradually becomes research and application material, not merely a check mark.
4. **Rewards reinforce consistency.** XP, streaks, and Journey Stamps celebrate returning without becoming the main purpose.
5. **The system protects momentum.** Drafts survive ordinary connectivity and authentication failures; repeated submissions cannot create duplicate rewards.
6. **Private by default.** Personal notes, links, and files belong to Dio and are not committed to GitHub.

## 3. V1 outcome and success criteria

V1 is successful when Dio can log in on a phone or laptop, see the same daily state, open one focused quest, work for approximately 15 minutes, submit one lightweight evidence item, and receive a clear reward.

The acceptance criteria are:

- The Today screen exposes one primary action and the quest can be completed in at most three interaction stages: start, submit evidence, receive reward.
- Progress and evidence are synchronized across phone and laptop.
- A missed quest produces a Recovery Quest without accumulating unfinished work.
- Repeated clicks, retries, or refreshes cannot grant duplicate XP or stamps.
- Draft text survives a network or expired-session interruption on the same device.
- Evidence is inaccessible to other users.
- A Google Calendar reminder at 18:00 WIB opens the Today experience.
- The core flow works at a 390 px mobile viewport and on desktop.

## 4. Scope

### Included in V1

- Mobile-first installable web application.
- Magic-link authentication.
- A curated 14-day Habit Sprint.
- One daily assignment with a focused Today screen.
- Start, evidence submission, completion, missed, and recovery states.
- Evidence as a short note, URL, or private file.
- XP, streak, weekly badge, Foundation Journey Stamp, and a compact progress view.
- Optional Sunday Review.
- Google Calendar reminder setup for 18:00 Asia/Jakarta.
- Cross-device synchronization.
- Private GitHub repository and Vercel deployment.

### Explicitly deferred

- Dynamically generated AI quests or an AI mentor chat.
- Browser push notifications.
- Social feeds, leaderboards, leagues, or competition.
- A content-management interface for editing quest packs.
- Multiple simultaneous learning tracks.
- Automated evaluation of evidence quality.
- A complete MEXT document-management system.
- Native iOS or Android applications.

## 5. Core experience

### 5.1 Today screen

The home screen uses the **Focused Quest** direction: a single Main Quest visually dominates the page. Secondary information stays compact so that opening the app does not recreate the feeling of facing a large project.

The screen contains:

- Dio's current day and short sprint theme.
- One quest title, its purpose, and an estimated 15-minute duration.
- A single primary action: **Start Quest** or **Continue Quest**.
- Compact streak and XP indicators.
- After starting, short microsteps and one evidence input.
- After completing, an immediate reward state and a short preview of what was built.

Reference material and the broader roadmap remain accessible from secondary navigation but must not compete with today's action.

### 5.2 Quest lifecycle

```text
Available → Started → Evidence submitted → Completed → Reward shown
     └──────────────── Missed after cutoff → Recovery Quest next day
```

- A quest is **available** for its assigned local day.
- Starting it records intent but does not grant a reward.
- Completion requires exactly one evidence item: note, URL, or file.
- Dio may optionally rate the quest difficulty after completion.
- Completion creates one immutable reward event.
- If the cutoff passes without completion, the quest becomes **missed**.
- A missed day resets the active streak but never removes XP, stamps, or historical progress.
- The next eligible day assigns the standard Recovery Quest instead of adding the missed quest to a backlog.

### 5.3 Time rules

- User timezone: `Asia/Jakarta`.
- Normal reminder: 18:00 WIB.
- A quest for a calendar day remains completable until 03:00 WIB the following day.
- Sunday Review is optional and does not affect streak.
- The backend is the source of truth for local-day boundaries and cutoff evaluation; the browser clock is not authoritative.

### 5.4 Recovery Quest

The standard Recovery Quest is intentionally small:

> Open the most recent evidence and add one useful sentence.

It uses the normal evidence and reward flow. Its purpose is to rebuild the act of returning, not compensate for the missed work.

## 6. Rewards and motivation

V1 uses **Journey Stamps**, supported by XP and a simple streak.

- Each completed daily quest grants XP once.
- Consecutive eligible quest days maintain a streak.
- Missing an eligible quest resets the active streak to zero.
- Historical XP and earned stamps are permanent.
- Completing at least five of the six Monday–Saturday quests in a sprint week earns a weekly badge.
- Completing the 14-day sprint review unlocks the **Foundation Stamp**.
- Sunday Review carries no streak penalty and is not required for the weekly badge.

Rewards must feel celebratory but brief. There are no spendable coins, punishment mechanics, rank decay, or public comparisons.

## 7. Curated 14-day Habit Sprint

The first sprint turns Dio's professional history and research interest into a small, reusable application foundation.

### Week 1 — “Cerita gue punya arah”

| Day | Quest | Evidence |
| --- | --- | --- |
| 1 | Write why pursuing this degree matters now. | One sentence. |
| 2 | Divide nine years of architectural experience into three useful pieces of evidence. | Three short bullets. |
| 3 | Build a problem bank around thermal comfort and energy use in landed houses. | At least three observed problems. |
| 4 | Choose the single problem with the strongest personal evidence and academic potential. | One selected problem and one reason. |
| 5 | Recall one project story that demonstrates design or analytical potential. | Situation, action, and learning in short form. |
| 6 | Draft “Why Japan” version 0. | Two academic reasons. |
| 7 | Optional Sunday Review. | Five-minute reflection; no streak impact. |

### Week 2 — “Topik gue bisa dicari”

| Day | Quest | Evidence |
| --- | --- | --- |
| 8 | Translate the research direction into searchable English. | Five keywords. |
| 9 | Find one relevant academic paper. | Paper title and URL. |
| 10 | Read only its abstract and extract the essentials. | Problem, method, and finding. |
| 11 | Find one researcher based at a Japanese university. | Name, university, and profile URL. |
| 12 | Save one recent paper by or relevant to that researcher. | Paper URL and one sentence explaining the fit. |
| 13 | Create Application Spine version 0.1. | Background → problem → research direction → why Japan → contribution. |
| 14 | Review the sprint and choose the next focus. | Short reflection and one next commitment. |

### Sprint output

By the end of the sprint, Dio should have:

- Evidence of a repeatable preparation habit.
- An initial problem statement.
- Five research keywords.
- One relevant paper and a structured abstract note.
- One potential researcher at a Japanese university.
- Application Spine version 0.1.
- The Foundation Stamp.

The recommended second sprint is an IELTS baseline sprint, but it is outside V1's initial content commitment.

## 8. Information architecture

V1 has four lightweight areas:

1. **Today** — the focused daily quest and completion flow.
2. **Journey** — the 14-day path, completed days, upcoming locked days, and Recovery state.
3. **Evidence** — Dio's private notes, URLs, and uploaded files, grouped by quest.
4. **Profile** — nickname, timezone, reminder setup, sign-out, and account settings.

The app opens on Today. Journey is for orientation, not daily task selection. Evidence is an archive, not a second task manager.

## 9. Technical architecture

```text
Google Calendar reminder
          ↓
Next.js mobile-first PWA on Vercel
          ↓
Supabase Auth + Postgres + private Storage

Source: private GitHub repository → Vercel deployment
Content: curated quest pack stored as versioned application data
```

- **Frontend/application:** Next.js with an installable mobile-first PWA shell.
- **Hosting:** Vercel.
- **Authentication:** Supabase magic-link authentication.
- **Database:** Supabase Postgres.
- **File evidence:** private Supabase Storage bucket.
- **Quest content:** a versioned curated pack shipped with or seeded by the application; no V1 CMS.
- **Reminder:** a Google Calendar event created from a simple setup action, scheduled for 18:00 WIB.
- **Source control:** private GitHub repository. Lockfiles are committed and dependencies are pinned according to the package manager's standard behavior.

## 10. Conceptual data model

### Profile

- Authenticated user ID.
- Display nickname, initially `Dio`.
- IANA timezone, initially `Asia/Jakarta`.
- Reminder preference and setup state.

The nickname is presentation data and must never be used for authorization.

### Quest pack and quest definition

- Pack identifier, version, title, and order.
- Quest identifier, day position, theme, instructions, estimated duration, evidence prompt, XP value, and quest type.
- Quest type distinguishes standard, recovery, and optional review quests.

### Daily assignment

- Authenticated owner.
- Local assignment date.
- Quest definition and pack version.
- Status: `available`, `started`, `completed`, or `missed`.
- Started, completed, and cutoff timestamps.
- Recovery relationship when applicable.

There is at most one assignment per user and eligible local date.

### Evidence

- Authenticated owner and assignment.
- Exactly one selected evidence mode: note, URL, or file.
- Private storage reference for files.
- Optional difficulty feedback.
- Created and updated timestamps.

### Reward ledger

- Authenticated owner and assignment.
- Immutable event type such as daily XP, weekly badge, or Journey Stamp.
- XP amount or reward identifier.
- Timestamp.

A uniqueness constraint on the assignment and reward type prevents duplicate grants. Derived totals and current streak are calculated from authoritative completion and ledger data rather than trusted from a client-submitted balance.

## 11. Security and privacy

- Row Level Security is enabled on every table exposed through the Supabase data API.
- Policies require authenticated ownership using the authenticated user ID for both reads and writes.
- Update policies include both row visibility and post-update ownership checks.
- User A must be unable to select, insert, update, or delete User B's profile, assignments, evidence, or rewards.
- The browser receives only the public Supabase client configuration. Service-role or secret keys remain server-side in Vercel environment variables and are never committed.
- Authorization does not depend on mutable user metadata.
- Evidence files use an owner-scoped path in a private bucket. Storage policies validate the authenticated owner for required read and write operations.
- If database views are introduced, they must respect the invoking user's security context.
- Personal evidence, `.env` files, local brainstorming artifacts, and secrets are excluded from Git.
- Current Supabase documentation and changelog must be checked before implementation because platform behavior and recommended keys may change.

## 12. Reliability and error handling

- Text and difficulty inputs are preserved as a local draft on the current device before network submission.
- A failed evidence upload keeps the selected file state where the browser permits and always retains the accompanying text draft. The UI offers an explicit retry.
- Completion and its XP reward are handled atomically and idempotently. A retry returns the existing result instead of creating a second reward.
- If authentication expires, the app asks Dio to sign in again and restores the local draft afterward.
- If offline, the most recently fetched quest may be displayed read-only and draft text may be saved locally. V1 does not promise full offline completion; final submission requires a connection.
- Loading, empty, offline, upload-failed, session-expired, and unexpected-error states receive visible explanations and one clear next action.
- No failure is represented as a successful completion until the backend has accepted it.

## 13. Testing and verification

### Unit tests

- Assignment eligibility and Asia/Jakarta date boundaries.
- The 03:00 grace cutoff.
- Missed-to-recovery transition without backlog.
- Streak continuation and reset behavior.
- Weekly badge qualification at five of six eligible quests.
- Sunday Review exclusion from streak and badge requirements.
- Reward-ledger uniqueness and duplicate-submit behavior.

### Integration tests

- Magic-link authenticated access to profile and assignments.
- Row Level Security denial across two test users for every private table.
- Private storage access and upload policy behavior.
- Atomic evidence completion and reward creation.
- Same Today state returned to two authenticated clients.

### End-to-end tests

- Sign in, open Today, start a quest, submit each evidence type, and see the reward.
- Refresh or double-submit during completion without receiving duplicate XP.
- Resume a text draft after a connectivity or session interruption.
- Observe a missed assignment and the following Recovery Quest.
- Verify phone and desktop show synchronized progress.
- Follow the Calendar reminder link into Today.

### Visual and accessibility checks

- Primary mobile viewport at 390 px and a representative desktop viewport.
- Keyboard navigation and visible focus states.
- Readable contrast, tap-target sizing, loading feedback, and error-state clarity.
- Production smoke test after Vercel deployment.
- Supabase security and performance advisors reviewed before production release.

## 14. Delivery boundaries

Implementation begins only after this design is approved and translated into a step-by-step implementation plan. The build should preserve this order of importance:

1. Secure authenticated data foundation.
2. Focused Today quest and evidence completion.
3. Correct daily/recovery and reward rules.
4. Journey and evidence views.
5. Calendar reminder and PWA polish.
6. Deployment, cross-device verification, and private GitHub handoff.

If a future feature makes the daily action feel larger or introduces punishment for missed work, it conflicts with the V1 product objective and requires a new design decision.

