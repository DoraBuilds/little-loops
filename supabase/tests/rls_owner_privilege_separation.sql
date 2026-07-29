-- Manual verification for supabase/migrations/20260729170000_household_owner_privilege_separation.sql
--
-- This is NOT run automatically anywhere (no pgTAP/CI wiring exists in
-- this repo yet) and has NOT been executed against a live Supabase
-- instance — review it before trusting it. Run it by hand against a
-- local or staging Supabase project — never production — after applying
-- the migration:
--
--   supabase start
--   supabase db reset          # applies all migrations, including the draft one
--   psql "$(supabase status -o env | grep DB_URL | cut -d= -f2)" \
--     -f supabase/tests/rls_owner_privilege_separation.sql
--
-- It creates two fake auth users (an owner and a parent) in one
-- household, then impersonates each via `set_config('request.jwt.claims', ...)`
-- — the same mechanism Supabase's PostgREST layer uses to populate
-- `auth.uid()` — and checks that each policy allows/denies as intended.
-- Every block raises NOTICE on pass and EXCEPTION on failure; a clean
-- run ends with "All checks passed".
--
-- Cleans up after itself (rolls back), so it's safe to re-run.
-- NOTE: if your local Supabase's auth.users has additional NOT NULL
-- columns beyond id/email, this insert will need more fields.

begin;

-- 1. Fixtures: one household, one owner, one parent.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'owner@test.local'),
  ('22222222-2222-2222-2222-222222222222', 'parent@test.local'),
  ('44444444-4444-4444-4444-444444444444', 'second-parent@test.local')
on conflict (id) do nothing;

insert into public.households (id, name, timezone, created_by_user_id)
values ('33333333-3333-3333-3333-333333333333', 'Test Household', 'Europe/Madrid', '11111111-1111-1111-1111-111111111111')
on conflict (id) do nothing;

insert into public.household_members (household_id, user_id, role) values
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'parent')
on conflict (household_id, user_id) do nothing;

-- Helper to impersonate a user for the rest of the session, matching how
-- PostgREST populates auth.uid() from the request JWT.
create or replace function pg_temp.impersonate(p_user_id uuid) returns void as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_user_id::text, 'role', 'authenticated')::text, true);
  set local role authenticated;
end;
$$ language plpgsql;

do $$
declare
  v_household_id uuid := '33333333-3333-3333-3333-333333333333';
  v_owner_id uuid := '11111111-1111-1111-1111-111111111111';
  v_parent_id uuid := '22222222-2222-2222-2222-222222222222';
  v_second_parent_id uuid := '44444444-4444-4444-4444-444444444444';
begin
  raise notice '--- Test 1: owner CAN rename the household ---';
  perform pg_temp.impersonate(v_owner_id);
  update public.households set name = 'Renamed by owner' where id = v_household_id;
  if (select name from public.households where id = v_household_id) = 'Renamed by owner' then
    raise notice 'PASS: owner renamed household';
  else
    raise exception 'FAIL: owner could not rename household';
  end if;

  raise notice '--- Test 2: parent CANNOT rename the household ---';
  perform pg_temp.impersonate(v_parent_id);
  update public.households set name = 'Renamed by parent' where id = v_household_id;
  if (select name from public.households where id = v_household_id) = 'Renamed by owner' then
    raise notice 'PASS: RLS blocked the parent''s update (0 rows affected)';
  else
    raise exception 'FAIL: parent was able to rename household';
  end if;

  raise notice '--- Test 3: parent CANNOT add a new household member ---';
  perform pg_temp.impersonate(v_parent_id);
  begin
    insert into public.household_members (household_id, user_id, role)
    values (v_household_id, v_second_parent_id, 'parent');
    raise exception 'FAIL: parent was able to insert a household member';
  exception
    when insufficient_privilege then
      raise notice 'PASS: parent could not insert a household member';
  end;

  raise notice '--- Test 4: owner CAN add a new household member ---';
  perform pg_temp.impersonate(v_owner_id);
  insert into public.household_members (household_id, user_id, role)
  values (v_household_id, v_second_parent_id, 'parent');
  if exists (select 1 from public.household_members where household_id = v_household_id and user_id = v_second_parent_id) then
    raise notice 'PASS: owner added a household member';
  else
    raise exception 'FAIL: owner could not add a household member';
  end if;

  raise notice '--- Test 5: owner CANNOT demote themselves as the sole owner ---';
  -- (v_parent_id and v_second_parent_id are both role='parent', so v_owner_id is still the only owner)
  -- A row that's visible via USING but fails WITH CHECK raises a hard error
  -- (unlike a USING mismatch, which silently affects 0 rows) — that's the
  -- expected outcome here, not a silent no-op.
  perform pg_temp.impersonate(v_owner_id);
  begin
    update public.household_members set role = 'parent' where household_id = v_household_id and user_id = v_owner_id;
    raise exception 'FAIL: the only owner was demoted, orphaning the household';
  exception
    when insufficient_privilege then
      raise notice 'PASS: last-owner demotion was blocked';
  end;

  raise notice '--- Test 6: owner CAN promote the second parent, then demote themselves ---';
  perform pg_temp.impersonate(v_owner_id);
  update public.household_members set role = 'owner' where household_id = v_household_id and user_id = v_second_parent_id;
  update public.household_members set role = 'parent' where household_id = v_household_id and user_id = v_owner_id;
  if (select role from public.household_members where household_id = v_household_id and user_id = v_owner_id) = 'parent' then
    raise notice 'PASS: demotion succeeded once a second owner existed';
  else
    raise exception 'FAIL: demotion was blocked even with a second owner present';
  end if;

  raise notice '--- Test 7: a parent CAN still add a child profile (shared parenting data) ---';
  perform pg_temp.impersonate(v_parent_id);
  insert into public.child_profiles (household_id, name) values (v_household_id, 'Test Kid');
  if exists (select 1 from public.child_profiles where household_id = v_household_id and name = 'Test Kid') then
    raise notice 'PASS: parent added a child profile';
  else
    raise exception 'FAIL: parent could not add a child profile — this should stay shared, see migration comments';
  end if;

  raise notice '--- All checks passed ---';
end $$;

rollback;
