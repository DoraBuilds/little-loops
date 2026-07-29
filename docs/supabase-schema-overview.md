# Supabase Schema Overview

This project now includes the first household-sync migration in:

- [20260410194500_create_household_schema.sql](../supabase/migrations/20260410194500_create_household_schema.sql)

## Tables

- `households`
- `household_members`
- `child_profiles`
- `routines`
- `routine_tasks`
- `daily_routine_progress`
- `daily_task_progress`

## Security Model

The migration enables row-level security and uses household membership as the root authorization rule.

High-level behavior:
- parents can only see households they belong to
- child profiles, routines, and progress inherit access from the household
- first household creation is allowed when `created_by_user_id = auth.uid()`

## Client Repository Layer

The frontend repository contracts live in:

- [repositories.ts](../src/lib/data/repositories.ts)
- [models.ts](../src/lib/data/models.ts)
- [supabase-household-repository.ts](../src/lib/data/supabase-household-repository.ts)

This is intentionally the first slice only.

Still missing:
- repositories for child profiles, routines, and daily progress
- typed Supabase database definitions
- true integration between the auth shell and the real household repository
- local-to-cloud import mapping
