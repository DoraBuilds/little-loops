-- Owner vs. parent privilege separation for household RLS (issue #59).
--
-- Today every write policy checks `is_household_member`, not role, so a
-- non-owner "parent" member has identical write access to the owner —
-- including household-identity changes and membership management. This
-- migration restricts two categories to owner-only:
--   1. household identity/settings (name, timezone, home_scene, schedules)
--   2. household_members writes (inviting, re-roling, or removing a member)
--
-- Day-to-day parenting data (child_profiles, routines, routine_tasks,
-- daily_routine_progress, daily_task_progress) is deliberately left
-- writable by any household member — co-parents are expected to both be
-- able to add a child, adjust a routine, or mark a task complete. Only
-- household identity and membership are treated as owner-only. This is a
-- product judgment call, not a security requirement — revisit if that's
-- not the intended behavior before this ships.
--
-- household_members previously had no update/delete policy at all, so
-- role changes and member removal were silently denied by RLS's
-- default-deny. This migration makes owner-only membership management
-- explicit ahead of the invite/co-parent flow the app roadmap
-- anticipates, and adds a guard against removing/demoting a household's
-- last remaining owner (which would orphan the household).
--
-- Depends on 20260729165000_fix_household_member_rls_recursion.sql
-- being applied first — is_household_owner() below queries
-- household_members the same way is_household_member() does, and needs
-- the same security-definer treatment to avoid the same recursion.
--
-- APPLIED TO PRODUCTION 2026-07-29. Verified locally end-to-end with
-- `supabase start`, then re-verified directly against production with
-- supabase/tests/rls_owner_privilege_separation.sql (self-rolling-back
-- transaction, no data touched) after deploying.

create or replace function public.is_household_owner(target_household_id uuid)
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
      and hm.role = 'owner'
  );
$$;

-- 1. Household identity/settings: owner-only update.
drop policy if exists "household members can update households" on public.households;
create policy "household owners can update households"
on public.households
for update
using (public.is_household_owner(id))
with check (public.is_household_owner(id));

-- 2. Household membership: owner-only insert/update/delete.
drop policy if exists "owners can insert household memberships" on public.household_members;
create policy "household owners can insert household memberships"
on public.household_members
for insert
with check (
  (
    -- Bootstrap path: the household creator inserting themselves as the
    -- first owner. Matches the existing behavior of bootstrap_household().
    user_id = auth.uid()
    and role = 'owner'
    and exists (
      select 1
      from public.households h
      where h.id = household_id
        and h.created_by_user_id = auth.uid()
    )
  )
  or public.is_household_owner(household_id)
);

create policy "household owners can update household memberships"
on public.household_members
for update
using (public.is_household_owner(household_id))
with check (
  public.is_household_owner(household_id)
  and (
    -- Allow the change unless it would demote the household's last owner.
    role = 'owner'
    or exists (
      select 1
      from public.household_members hm
      where hm.household_id = household_members.household_id
        and hm.role = 'owner'
        and hm.id <> household_members.id
    )
  )
);

create policy "household owners can delete household memberships"
on public.household_members
for delete
using (
  public.is_household_owner(household_id)
  and (
    -- Allow the delete unless it would remove the household's last owner.
    role <> 'owner'
    or exists (
      select 1
      from public.household_members hm
      where hm.household_id = household_members.household_id
        and hm.role = 'owner'
        and hm.id <> household_members.id
    )
  )
);
