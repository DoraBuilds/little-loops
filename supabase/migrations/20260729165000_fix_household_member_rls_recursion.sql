-- Fixes infinite recursion in RLS when checking household membership.
--
-- `is_household_member()` queries `household_members`, which has its own
-- SELECT policy of `using (public.is_household_member(household_id))`.
-- Since the function is not `security definer`, its internal query runs
-- as the calling role and is itself subject to that same SELECT policy —
-- which calls `is_household_member()` again, forever. Verified locally:
-- as an authenticated user, `select * from household_members` (and any
-- policy that calls `is_household_member`, i.e. almost every table in
-- this schema) raises `stack depth limit exceeded`. This is not
-- specific to any new policy — it reproduces against the original,
-- unmodified schema from 20260410194500_create_household_schema.sql.
--
-- This is on the app's hot path: `ensureHousehold()` calls
-- `SupabaseHouseholdRepository.getCurrentHousehold()` on every signed-in
-- app load, which does a plain client-side select against
-- `household_members`. Worth checking whether this is contributing to
-- past intermittent bootstrap/timeout symptoms (#64, #96, #97, #100) —
-- a query that recurses for a while before erroring or hitting a
-- statement timeout would look like a stuck spinner from the client.
--
-- Fix: mark the helper `security definer` (Supabase's standard pattern
-- for exactly this case) so its internal query runs as the function
-- owner and bypasses RLS, instead of re-entering the policy that calls
-- it. `auth.uid()` still resolves to the original caller's JWT — it
-- reads a session GUC, not the executing role — so this doesn't change
-- who the check is actually evaluated for.
--
-- NOT APPLIED TO PRODUCTION. Verified locally with `supabase start` +
-- supabase/tests/rls_owner_privilege_separation.sql; see that file for
-- how to reproduce and confirm.

create or replace function public.is_household_member(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household_id
      and hm.user_id = auth.uid()
  );
$$;
