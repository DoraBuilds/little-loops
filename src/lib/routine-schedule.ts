import type { Child, RoutineType } from '@/lib/types';

const parseTime = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const isWithinSchedule = (start: string, end: string, minutes: number) => {
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);

  if (startMinutes <= endMinutes) {
    return minutes >= startMinutes && minutes <= endMinutes;
  }

  return minutes >= startMinutes || minutes <= endMinutes;
};

/** The routine actively within its scheduled window right now, if any. */
export const getDueRoutine = (child: Child, now: Date): RoutineType | null => {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const morning = child.schedule?.morning;
  const evening = child.schedule?.evening;

  if (morning && isWithinSchedule(morning.start, morning.end, minutes)) {
    return 'morning';
  }

  if (evening && isWithinSchedule(evening.start, evening.end, minutes)) {
    return 'evening';
  }

  return null;
};

/** Which routine to show for a single child: the due one, or a sensible fallback. */
export const getDisplayRoutine = (child: Child, now: Date): RoutineType => {
  const dueRoutine = getDueRoutine(child, now);
  // If a schedule window is actively due, always honour it — even if that routine
  // has no tasks yet (that's a parent config issue, not a display bug).
  if (dueRoutine) return dueRoutine;

  // Time-based fallback: show the most recently started routine.
  const minutes = now.getHours() * 60 + now.getMinutes();
  const morningStart = child.schedule?.morning ? parseTime(child.schedule.morning.start) : null;
  const eveningStart = child.schedule?.evening ? parseTime(child.schedule.evening.start) : null;

  let candidate: RoutineType;
  if (eveningStart !== null && minutes >= eveningStart) candidate = 'evening';
  else if (morningStart !== null && minutes >= morningStart) candidate = 'morning';
  else if (morningStart !== null) candidate = 'morning';
  else if (eveningStart !== null) candidate = 'evening';
  else candidate = 'morning';

  // Never show a routine with zero tasks when the other routine has tasks.
  // This is the most common cause of "0/0 tasks" — both schedules exist by
  // default, but a child may only have tasks in one of them.
  const other: RoutineType = candidate === 'morning' ? 'evening' : 'morning';
  if (child[candidate].length === 0 && child[other].length > 0) {
    return other;
  }

  return candidate;
};

/**
 * Household-wide theme (greeting/backdrop) for the kid-picker screen, across
 * all children — not tied to any one child's schedule. Reuses the exact same
 * per-child logic as getDueRoutine/getDisplayRoutine so this can never drift
 * from what actually happens once a routine is opened (see: the "Good
 * morning" greeting showing while a family's evening routine, scheduled
 * earlier than 5pm, was already the one due — this function replaced a
 * hardcoded 5am-5pm boundary that caused that mismatch).
 */
export const getHouseholdTheme = (children: Child[], now: Date): RoutineType => {
  if (children.length === 0) return 'morning';

  const dueRoutines = children.map((child) => getDueRoutine(child, now));
  if (dueRoutines.includes('morning')) return 'morning';
  if (dueRoutines.includes('evening')) return 'evening';

  // Nothing actively due for any child — fall back the same way a single
  // child would (most recently started routine).
  const displayRoutines = children.map((child) => getDisplayRoutine(child, now));
  return displayRoutines.includes('evening') ? 'evening' : 'morning';
};
