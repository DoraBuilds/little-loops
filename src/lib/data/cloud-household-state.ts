import type { Child, HomeScene, IconKey, Task } from '@/lib/types';
import { TASK_CATALOG_BY_ID } from '@/lib/types';
import type { ChildProfileRecord, HouseholdRecord, RoutineRecord, RoutineTaskRecord } from './models';
import { SupabaseChildProfileRepository } from './supabase-child-profile-repository';
import { SupabaseRoutineRepository } from './supabase-routine-repository';
import { SupabaseProgressRepository } from './supabase-progress-repository';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface CloudHouseholdState {
  children: Child[];
  homeScene: HomeScene;
}

const getLocalProgressDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const DEFAULT_SCHEDULE = {
  morning: { start: '07:00', end: '09:00' },
  evening: { start: '17:00', end: '20:00' },
} as const;

const buildTaskFromCloud = (task: RoutineTaskRecord): Task => {
  if (task.taskTemplateId) {
    const template = TASK_CATALOG_BY_ID[task.taskTemplateId];
    if (template) {
      return {
        id: task.id,
        title: template.title,
        icon: template.icon,
        completed: false,
      };
    }
  }

  return {
    id: task.id,
    title: task.customTitle ?? 'Custom task',
    icon: (task.customIcon ?? 'sparkles') as IconKey,
    completed: false,
  };
};

export const mapCloudHouseholdToChildren = (input: {
  childProfiles: ChildProfileRecord[];
  routinesByChildId: Record<string, { routines: RoutineRecord[]; routineTasks: RoutineTaskRecord[] }>;
  // Completed task IDs from daily_task_progress for today, keyed by child profile ID.
  // When absent (e.g. tests, offline fallback) all tasks default to incomplete.
  completionsByChildId?: Record<string, { morning: Set<string>; evening: Set<string> }>;
}) =>
  input.childProfiles.map((profile) => {
    const childRoutines = input.routinesByChildId[profile.id] ?? { routines: [], routineTasks: [] };
    const routines = Object.fromEntries(
      childRoutines.routines.map((routine) => [routine.type, routine])
    ) as Partial<Record<string, RoutineRecord>>;
    const tasksByRoutineId = Object.fromEntries(
      childRoutines.routines.map((routine) => [
        routine.id,
        childRoutines.routineTasks
          .filter((task) => task.routineId === routine.id && !task.isArchived)
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .map(buildTaskFromCloud),
      ])
    ) as Record<string, Task[]>;

    // Completion is read from daily_task_progress (matched by task UUID), not from
    // the task_completion JSONB column. The JSONB column was overwritten by config
    // sync and could end up with a stale "all done" entry from the previous day.
    const completions = input.completionsByChildId?.[profile.id] ?? {
      morning: new Set<string>(),
      evening: new Set<string>(),
    };

    // Restore streakDate from the special _streakDate sentinel key.
    const streakDate = typeof profile.taskCompletion?.['_streakDate'] === 'string'
      ? profile.taskCompletion['_streakDate'] as string
      : undefined;

    // Streak reset: if the last recorded streak day is neither today nor
    // yesterday, the child missed at least one day → reset to 0.
    const todayKey = getLocalProgressDate(new Date());
    const yesterday = getLocalProgressDate(new Date(Date.now() - 86_400_000));
    const streakIsStale =
      streakDate !== undefined &&
      streakDate !== todayKey &&
      streakDate !== yesterday;
    const resolvedStreak = streakIsStale ? 0 : profile.streak;

    return {
      id: profile.id,
      name: profile.name,
      age: profile.age ?? undefined,
      ageBucket: profile.ageBucket ?? undefined,
      avatarAnimal: profile.avatarAnimal ?? undefined,
      avatarSeed: profile.avatarSeed ?? profile.id,
      mascotId: profile.mascotId ?? undefined,
      streak: resolvedStreak,
      streakDate,
      affirmations: profile.affirmations,
      badges: profile.badges,
      moods: profile.moods,
      schedule: {
        morning: routines.morning
          ? { start: routines.morning.startTime, end: routines.morning.endTime }
          : { ...DEFAULT_SCHEDULE.morning },
        evening: routines.evening
          ? { start: routines.evening.startTime, end: routines.evening.endTime }
          : { ...DEFAULT_SCHEDULE.evening },
      },
      morning: (routines.morning ? tasksByRoutineId[routines.morning.id] ?? [] : [])
        .map((t) => ({ ...t, completed: completions.morning.has(t.id) })),
      evening: (routines.evening ? tasksByRoutineId[routines.evening.id] ?? [] : [])
        .map((t) => ({ ...t, completed: completions.evening.has(t.id) })),
    };
  });

export const loadCloudHouseholdState = async (
  household: HouseholdRecord
): Promise<CloudHouseholdState> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const childRepository = new SupabaseChildProfileRepository(supabase);
  const routineRepository = new SupabaseRoutineRepository(supabase);
  const progressRepository = new SupabaseProgressRepository(supabase);
  const childProfiles = await childRepository.listByHousehold(household.id);
  const [routinePairs, completionsByChildId] = await Promise.all([
    Promise.all(
      childProfiles.map(async (profile) => [profile.id, await routineRepository.listByChild(profile.id)] as const)
    ),
    progressRepository.getCompletedTaskIds({
      childProfileIds: childProfiles.map((p) => p.id),
      progressDate: getLocalProgressDate(new Date()),
    }),
  ]);

  const children = mapCloudHouseholdToChildren({
    childProfiles,
    routinesByChildId: Object.fromEntries(routinePairs),
    completionsByChildId,
  });

  return {
    homeScene: household.homeScene,
    children,
  };
};

export { getLocalProgressDate };
