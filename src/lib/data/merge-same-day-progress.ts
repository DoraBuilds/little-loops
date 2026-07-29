import type { Child, Task } from '@/lib/types';

/**
 * Merges same-day task completions from a same-device local cache into
 * freshly loaded cloud state. Cloud is authoritative for everything else
 * (routine/task structure, new/removed children) — this only prevents a
 * completion the user made locally from silently reverting to incomplete
 * when the cloud write for it hasn't landed yet (e.g. a dropped network
 * request from `toggleTask`'s fire-and-forget cloud sync). Completion is
 * monotonic: once true from either source, it stays true.
 *
 * Only call this when the local cache is confirmed to be from today —
 * stale local data should not be merged in.
 */
const mergeRoutineCompletions = (cloudTasks: Task[], localTasks: Task[]): Task[] => {
  const localTaskById = new Map(localTasks.map((task) => [task.id, task]));
  return cloudTasks.map((task) => {
    const localTask = localTaskById.get(task.id);
    if (!localTask || task.completed || !localTask.completed) return task;
    return { ...task, completed: true };
  });
};

export const mergeTodaysCompletions = (cloudChildren: Child[], localChildren: Child[]): Child[] => {
  const localChildById = new Map(localChildren.map((child) => [child.id, child]));
  return cloudChildren.map((cloudChild) => {
    const localChild = localChildById.get(cloudChild.id);
    if (!localChild) return cloudChild;
    return {
      ...cloudChild,
      morning: mergeRoutineCompletions(cloudChild.morning, localChild.morning),
      evening: mergeRoutineCompletions(cloudChild.evening, localChild.evening),
    };
  });
};
