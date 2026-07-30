# Supabase Production Setup

This project uses Supabase Auth + Postgres (RLS) for parent accounts and cross-device household sync.

## Prereqs

- Supabase CLI installed (`supabase --version`)
- You can log in: `supabase login`
- You have a Supabase project created

## 1) Link The Local Repo To The Project

Run from the repo root:

```bash
supabase link --project-ref <your-project-ref>
```

If you don’t know the project ref, find it in the Supabase dashboard URL or project settings.

## 2) Push Migrations (Schema + RLS + RPC)

```bash
supabase db push
```

Expected outcomes:
- Tables exist: `households`, `household_members`, `child_profiles`, `routines`, `routine_tasks`, `daily_routine_progress`, `daily_task_progress`
- Function exists: `public.bootstrap_household(p_name text, p_timezone text)`
- RLS is enabled on all tables above

## 3) Configure Auth Redirect URLs

In Supabase Dashboard:
- Authentication -> URL Configuration -> Redirect URLs

Add:
- `https://<your-domain>/auth/callback`

For local testing, also add:
- `http://localhost:5173/auth/callback` (or whatever port Vite uses)

## 4) Configure App Environment Variables

Set these in the deployed environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 5) Manual Acceptance Test (Cross-Device)

1. On laptop: sign up, finish callback, ensure parent shows as signed in and “family space” is ready.
2. Create at least 1 child profile and 1 routine task.
3. On iPad: sign in with the same email.
4. Confirm the child profile and routines appear on the iPad.

If step (4) fails but sign-in succeeds:
- The most common causes are missing migrations/RLS/RPC, or missing redirect allow-list entries.

