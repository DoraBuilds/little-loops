import type { AgeBucket, IconKey } from './task-catalog';
import { AGE_BUCKETS, DEFAULT_CHILDREN, groupTasksByAge, ICON_OPTIONS, TASK_CATALOG, TASK_CATALOG_BY_ID, TASK_LIBRARY } from './task-catalog';
import type { MoodEntry } from './mascots';

export type Task = {
  id: string;
  title: string;
  icon: IconKey;
  completed: boolean;
};

export type RoutineType = 'morning' | 'evening';
export type HomeScene = 'bike' | 'school' | 'kite' | 'sandcastle';

export type RoutineSchedule = {
  start: string;
  end: string;
};

export type Child = {
  id: string;
  name: string;
  age?: number;
  ageBucket?: AgeBucket;
  // Legacy avatar fields (kept for cloud compat)
  avatarSeed?: string;
  avatarAnimal?: string;
  // New mascot system
  mascotId?: string;
  // New feature data (stored locally for now)
  streak?: number;
  /** ISO date string (YYYY-MM-DD) of the last day the streak was incremented */
  streakDate?: string;
  /** Whether to fire confetti + balloons on routine completion (default true) */
  celebrateStreaks?: boolean;
  affirmations?: string[];
  moods?: MoodEntry[];
  badges?: Record<string, boolean>;
  schedule?: Record<RoutineType, RoutineSchedule>;
  morning: Task[];
  evening: Task[];
};

export type AppView = 'landing' | 'account' | 'import' | 'recovery' | 'setup' | 'home' | 'routine' | 'parent' | 'advanced-settings' | 'bootstrap-error';

export { AGE_BUCKETS, DEFAULT_CHILDREN, groupTasksByAge, ICON_OPTIONS, TASK_CATALOG, TASK_CATALOG_BY_ID, TASK_LIBRARY };
