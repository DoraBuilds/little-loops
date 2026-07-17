alter table public.households
  add column if not exists schedules jsonb not null default '[]'::jsonb;

comment on column public.households.schedules is
  'Reusable household schedule plans, including child assignments and timetable items.';
