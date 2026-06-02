import type { Child, HomeScene, RoutineType } from '@/lib/types';
import type { HouseholdRecord } from './models';
import { TASK_CATALOG } from '@/lib/types';
import { SupabaseChildProfileRepository } from './supabase-child-profile-repository';
import { SupabaseHouseholdRepository } from './supabase-household-repository';
import { SupabaseRoutineRepository } from './supabase-routine-repository';
import { getSupabaseClient } from '@/lib/supabase/client';

const findTemplateForTask = (
  title: string,
  icon: string,
  routine: RoutineType
) =>
  TASK_CATALOG[routine].find((task) => task.title === title && task.icon === icon) ?? null;

const describeStepError = (step: string, error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : 'Unknown cloud sync failure.';

  return new Error(`${step} Failed: ${message}`);
};

export const saveHouseholdConfigToCloud = async (input: {
  household: HouseholdRecord;
  children: Child[];
  homeScene: HomeScene;
  removeMissingChildren?: boolean;
}) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const householdRepository = new SupabaseHouseholdRepository(supabase);
  const childRepository = new SupabaseChildProfileRepository(supabase);
  const routineRepository = new SupabaseRoutineRepository(supabase);

  try {
    await householdRepository.updateHomeScene(input.household.id, input.homeScene);
  } catch (error) {
    throw describeStepError('Updating household home scene.', error);
  }

  if (input.removeMissingChildren) {
    let existingChildren;
    try {
      existingChildren = await childRepository.listByHousehold(input.household.id);
    } catch (error) {
      throw describeStepError('Loading existing child profiles.', error);
    }
    const localChildIds = new Set(input.children.map((child) => child.id));

    try {
      await Promise.all(
        existingChildren
          .filter((childProfile) => !localChildIds.has(childProfile.id))
          .map((childProfile) => childRepository.remove(childProfile.id))
      );
    } catch (error) {
      throw describeStepError('Removing old cloud child profiles.', error);
    }
  }

  for (const child of input.children) {
    let savedChild;
    try {
      savedChild = await childRepository.upsert({
        id: child.id,
        householdId: input.household.id,
        name: child.name,
        age: child.age ?? null,
        ageBucket: child.ageBucket ?? null,
        avatarAnimal: child.avatarAnimal ?? null,
        avatarSeed: child.avatarSeed ?? null,
        mascotId: child.mascotId ?? null,
        streak: child.streak ?? 0,
        affirmations: child.affirmations ?? [],
        badges: child.badges ?? {},
        moods: (child.moods ?? []).map((m) => ({ day: m.day, emoji: m.emoji, note: m.note ?? null })),
        taskCompletion: {
          // Completion is now read from daily_task_progress (written on each task toggle),
          // so we no longer store it here. Only the streak sentinel is kept.
          _streakDate: child.streakDate ?? null,
        },
      });
    } catch (error) {
      throw describeStepError(`Upserting child profile "${child.name}".`, error);
    }

    for (const routineType of ['morning', 'evening'] as const) {
      let routine;
      try {
        routine = await routineRepository.upsertRoutine({
          childProfileId: savedChild.id,
          type: routineType,
          startTime: child.schedule?.[routineType].start ?? (routineType === 'morning' ? '07:00' : '17:00'),
          endTime: child.schedule?.[routineType].end ?? (routineType === 'morning' ? '09:00' : '20:00'),
        });
      } catch (error) {
        throw describeStepError(
          `Upserting the ${routineType} routine for "${child.name}".`,
          error
        );
      }

      try {
        await routineRepository.replaceRoutineTasks({
          routineId: routine.id,
          tasks: child[routineType].map((task, index) => {
            const matchedTemplate = findTemplateForTask(task.title, task.icon, routineType);

            return {
              taskTemplateId: matchedTemplate?.id ?? null,
              customTitle: matchedTemplate ? null : task.title,
              customIcon: matchedTemplate ? null : task.icon,
              sortOrder: index,
              isArchived: false,
            };
          }),
        });
      } catch (error) {
        throw describeStepError(
          `Saving ${routineType} routine tasks for "${child.name}".`,
          error
        );
      }
    }
  }
};
