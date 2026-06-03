# Accounts Architecture

## Recommendation

Use **Supabase** for the first accounts-and-sync phase.

Why this fits this app:
- The app already behaves like a client-heavy React app with simple CRUD flows.
- Parent accounts, household membership, and child-profile data map naturally to relational tables.
- Supabase Auth and Postgres Row Level Security are designed to work together from the browser.
- The current product likely benefits more from a clear household data model than from Firebase's document-first query model.

This is an architecture recommendation, not an implementation yet.

## First Account MVP

Keep the first cloud scope intentionally small:

- Parent-only login
- One household per account
- Multiple children per household
- No child login
- Sync these data types first:
  - child profiles
  - morning/evening routine definitions
  - schedules
  - home scene preference
  - daily progress

Defer for later:
- co-parent invites
- multiple households per parent
- rewards economy
- photo-to-avatar generation
- advanced audit history

## Why Supabase Over Firebase

Supabase is the better first fit here because this product wants:
- a household/member/child/routine relationship model
- record-level access control tied to authenticated parents
- straightforward SQL migrations
- a clean path from local browser state to normalized cloud state

Firebase would also work, but it pushes us earlier into document-shape and rule-shape tradeoffs. For this app, the household data model feels more naturally relational than document-first.

## Source Notes

Official docs used for this recommendation:
- Supabase Auth overview: [supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
- Supabase RLS / API security: [supabase.com/docs/guides/api/securing-your-api](https://supabase.com/docs/guides/api/securing-your-api)
- Supabase RLS deep dive: [supabase.com/docs/learn/auth-deep-dive/auth-row-level-security](https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security)
- Firebase Auth overview: [firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)
- Firebase Firestore rules: [firebase.google.com/docs/firestore/security/get-started](https://firebase.google.com/docs/firestore/security/get-started)

Inference:
- The docs do not say "Supabase is better for this app." That recommendation is my architecture judgment based on the app's current data shape and likely roadmap.

## Target Data Model

### auth.users

Managed by Supabase Auth.

### households

- `id`
- `name`
- `timezone`
- `created_by_user_id`
- `home_scene`
- `created_at`
- `updated_at`

### household_members

- `id`
- `household_id`
- `user_id`
- `role` (`owner`, `parent`)
- `created_at`

### child_profiles

- `id`
- `household_id`
- `name`
- `age`
- `age_bucket`
- `avatar_animal`
- `avatar_seed`
- `created_at`
- `updated_at`

### routines

- `id`
- `child_profile_id`
- `type` (`morning`, `evening`)
- `start_time`
- `end_time`
- `created_at`
- `updated_at`

### routine_tasks

- `id`
- `routine_id`
- `task_template_id` nullable
- `custom_title` nullable
- `custom_icon` nullable
- `sort_order`
- `is_archived`
- `created_at`
- `updated_at`

### daily_routine_progress

- `id`
- `child_profile_id`
- `routine_type`
- `progress_date`
- `completed_at` nullable
- `created_at`
- `updated_at`

### daily_task_progress

- `id`
- `daily_routine_progress_id`
- `routine_task_id`
- `completed`
- `completed_at` nullable

### task_templates

Two viable options:

1. Keep catalog templates in app code but use stable IDs everywhere.
2. Seed templates into the database for server-side catalog evolution.

Recommendation:
- Start with stable app-seeded template IDs.
- Add DB-backed templates only if cross-platform/admin-managed catalog changes become important.

## Security Model

### MVP Rules

- A signed-in parent can read and write only rows belonging to households they are a member of.
- Household membership is the root authorization check.
- Every child profile, routine, and progress row must resolve back to a household membership check.

### Example Policy Shape

- `households`: user can access rows where they are a member
- `household_members`: user can read their own memberships; only household owners can invite later
- `child_profiles`: user can access rows in member households
- `routines`: user can access rows through the child's household
- `routine_tasks`: user can access rows through the routine's child household
- `daily_routine_progress`: user can access rows through the child's household
- `daily_task_progress`: user can access rows through the daily progress record's household

## Frontend Architecture Changes

The current app stores one anonymous `localStorage` blob in [Index.tsx](/Users/doraangelov/CodexProjects/daily-star-chart/src/pages/Index.tsx).

Before cloud sync, we should split frontend responsibilities into:

- `auth/session state`
- `household + profile config state`
- `routine definition state`
- `daily progress state`
- `transient UI state`

Recommended frontend modules:
- `src/lib/auth/`
- `src/lib/data/`
- `src/lib/mappers/`
- `src/lib/storage/`
- `src/lib/sync/`

Recommended first repository interfaces:
- `AuthRepository`
- `HouseholdRepository`
- `ChildProfileRepository`
- `RoutineRepository`
- `ProgressRepository`

## Migration Plan

### Phase 1

Prepare the app for cloud data without enabling accounts yet.

- add schema versioning to local data
- stop relying on task titles as identifiers
- normalize internal types so routines and progress are separated

### Phase 2

Introduce parent authentication and cloud-backed households.

- sign up / sign in / sign out
- create household on first login
- migrate app bootstrap to auth-aware loading

### Phase 3

Migrate local families into the cloud.

- detect existing `little_loops_data`
- prompt parent to import local setup after login
- map existing local children/routines into normalized records
- preserve old local data until import succeeds

### Phase 4

Make cloud the canonical source and local storage an offline cache.

## Main Risks

- Current task objects do not distinguish template-backed tasks from custom tasks.
- Daily reset is currently device-local and date-string based.
- Current IDs are client-generated and local-only.
- The current app shape mixes profile, routine definition, and daily progress in one `Child` object.

## Recommended Build Order

1. Normalize local data model and add schema versioning
2. Add Supabase project scaffolding and typed client
3. Implement parent auth shell
4. Add household + child + routine tables and RLS
5. Build repositories and app bootstrap hydration
6. Add local-to-cloud import flow
7. Add optional co-parent support later
