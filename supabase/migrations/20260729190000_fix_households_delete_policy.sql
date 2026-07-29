-- Fixes a self-referencing bug in the households DELETE policy, and
-- captures the policy in git for the first time (issue #158).
--
-- This policy exists in production but was never in a committed
-- migration — found via schema drift while deploying #59. Production's
-- current definition:
--
--   using (exists (
--     select 1 from household_members hm
--     where hm.household_id = hm.id            -- bug
--       and hm.user_id = auth.uid()
--       and hm.role = 'owner'
--   ))
--
-- `hm.household_id = hm.id` compares two columns on the same candidate
-- row instead of correlating to the household being deleted (should be
-- `hm.household_id = households.id`). Since household_id and id are
-- independently-generated UUIDs, this is practically always false — the
-- policy silently blocks every delete, for everyone, including actual
-- owners. Low real-world impact today since no delete-household feature
-- exists in the app UI, but it needs to work correctly whenever one
-- does.
--
-- Fix: correlate to the outer household row directly, and use the same
-- is_household_owner() helper the rest of the schema uses for
-- consistency.

drop policy if exists "household owners can delete households" on public.households;
create policy "household owners can delete households"
on public.households
for delete
using (public.is_household_owner(id));
