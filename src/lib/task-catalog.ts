import type { Child, RoutineType, Task } from './types';

export type IconKey =
  | 'bed' | 'utensils' | 'shirt' | 'bath' | 'footprints' | 'moon-star'
  | 'smile' | 'sparkles' | 'brush' | 'scissors' | 'apple' | 'book-open'
  | 'music' | 'heart' | 'backpack' | 'hand' | 'package-open' | 'chef-hat'
  | 'toilet' | 'shower-head' | 'glass-water' | 'milk' | 'banana' | 'sandwich'
  | 'pill' | 'sun' | 'star' | 'palette' | 'pencil' | 'puzzle' | 'bike'
  | 'dumbbell' | 'trophy' | 'alarm-clock' | 'flower' | 'gamepad' | 'wand'
  | 'egg' | 'cookie' | 'ice-cream' | 'flame' | 'fish' | 'bird' | 'snowflake'
  | 'salad' | 'pizza' | 'cup-soda' | 'biceps-flexed' | 'baby';

export type AgeBucket = '2-4' | '4-6' | '6-8';

export type IconOption = {
  key: IconKey;
  label: string;
  routines: readonly RoutineType[];
  category: 'core' | 'self-care' | 'prep' | 'meal' | 'wind-down' | 'comfort';
};

export type TaskCatalogItem = {
  id: string;
  title: string;
  icon: IconKey;
  routines: readonly RoutineType[];
  ages: readonly AgeBucket[];
  category: 'reset' | 'self-care' | 'prep' | 'meal' | 'wind-down' | 'comfort';
  featured?: boolean;
};

export const AGE_BUCKETS: readonly { key: AgeBucket; label: string; description: string }[] = [
  { key: '2-4', label: 'Ages 2-4', description: 'Simple first routines and tidy-up steps' },
  { key: '4-6', label: 'Ages 4-6', description: 'Independent getting-ready and helping tasks' },
  { key: '6-8', label: 'Ages 6-8', description: 'Bigger responsibility and household-helper tasks' },
] as const;

export const ICON_OPTIONS = [
  { key: 'bed',           label: 'Bed',         routines: ['morning'],            category: 'core' },
  { key: 'sparkles',      label: 'Sparkles',    routines: ['morning', 'evening'], category: 'core' },
  { key: 'package-open',  label: 'Put away',    routines: ['morning', 'evening'], category: 'core' },
  { key: 'alarm-clock',   label: 'Wake up',     routines: ['morning'],            category: 'core' },
  { key: 'sun',           label: 'Outside',     routines: ['morning', 'evening'], category: 'core' },
  { key: 'star',          label: 'Star',        routines: ['morning', 'evening'], category: 'core' },
  { key: 'trophy',        label: 'Trophy',      routines: ['morning', 'evening'], category: 'core' },
  { key: 'wand',          label: 'Magic',       routines: ['morning', 'evening'], category: 'core' },
  { key: 'toilet',        label: 'Toilet',      routines: ['morning', 'evening'], category: 'self-care' },
  { key: 'shower-head',   label: 'Shower',      routines: ['morning', 'evening'], category: 'self-care' },
  { key: 'bath',          label: 'Bath',        routines: ['evening'],            category: 'self-care' },
  { key: 'brush',         label: 'Brush teeth', routines: ['morning', 'evening'], category: 'self-care' },
  { key: 'scissors',      label: 'Hair',        routines: ['morning', 'evening'], category: 'self-care' },
  { key: 'hand',          label: 'Wash hands',  routines: ['morning', 'evening'], category: 'self-care' },
  { key: 'pill',          label: 'Medicine',    routines: ['morning', 'evening'], category: 'self-care' },
  { key: 'dumbbell',      label: 'Exercise',    routines: ['morning', 'evening'], category: 'self-care' },
  { key: 'biceps-flexed', label: 'Strong',      routines: ['morning', 'evening'], category: 'self-care' },
  { key: 'snowflake',     label: 'Winter gear', routines: ['morning'],            category: 'self-care' },
  { key: 'utensils',      label: 'Eating',      routines: ['morning', 'evening'], category: 'meal' },
  { key: 'chef-hat',      label: 'Kitchen',     routines: ['morning', 'evening'], category: 'meal' },
  { key: 'apple',         label: 'Apple',       routines: ['morning', 'evening'], category: 'meal' },
  { key: 'banana',        label: 'Banana',      routines: ['morning', 'evening'], category: 'meal' },
  { key: 'sandwich',      label: 'Sandwich',    routines: ['morning', 'evening'], category: 'meal' },
  { key: 'salad',         label: 'Salad',       routines: ['morning', 'evening'], category: 'meal' },
  { key: 'pizza',         label: 'Pizza',       routines: ['morning', 'evening'], category: 'meal' },
  { key: 'egg',           label: 'Egg',         routines: ['morning'],            category: 'meal' },
  { key: 'milk',          label: 'Milk',        routines: ['morning', 'evening'], category: 'meal' },
  { key: 'glass-water',   label: 'Water',       routines: ['morning', 'evening'], category: 'meal' },
  { key: 'cup-soda',      label: 'Drink',       routines: ['morning', 'evening'], category: 'meal' },
  { key: 'cookie',        label: 'Snack',       routines: ['morning', 'evening'], category: 'meal' },
  { key: 'ice-cream',     label: 'Ice cream',   routines: ['morning', 'evening'], category: 'meal' },
  { key: 'shirt',         label: 'Clothes',     routines: ['morning', 'evening'], category: 'prep' },
  { key: 'footprints',    label: 'Shoes',       routines: ['morning'],            category: 'prep' },
  { key: 'backpack',      label: 'Backpack',    routines: ['morning'],            category: 'prep' },
  { key: 'pencil',        label: 'Homework',    routines: ['morning', 'evening'], category: 'prep' },
  { key: 'bike',          label: 'Bike',        routines: ['morning', 'evening'], category: 'prep' },
  { key: 'moon-star',     label: 'Bedtime',     routines: ['evening'],            category: 'wind-down' },
  { key: 'book-open',     label: 'Reading',     routines: ['evening'],            category: 'wind-down' },
  { key: 'flame',         label: 'Candle',      routines: ['evening'],            category: 'wind-down' },
  { key: 'smile',         label: 'Smile',       routines: ['morning', 'evening'], category: 'comfort' },
  { key: 'heart',         label: 'Love',        routines: ['morning', 'evening'], category: 'comfort' },
  { key: 'music',         label: 'Music',       routines: ['morning', 'evening'], category: 'comfort' },
  { key: 'palette',       label: 'Art',         routines: ['morning', 'evening'], category: 'comfort' },
  { key: 'puzzle',        label: 'Puzzle',      routines: ['morning', 'evening'], category: 'comfort' },
  { key: 'gamepad',       label: 'Game',        routines: ['morning', 'evening'], category: 'comfort' },
  { key: 'flower',        label: 'Flower',      routines: ['morning', 'evening'], category: 'comfort' },
  { key: 'bird',          label: 'Bird',        routines: ['morning', 'evening'], category: 'comfort' },
  { key: 'fish',          label: 'Fish',        routines: ['morning', 'evening'], category: 'comfort' },
  { key: 'baby',          label: 'Baby',        routines: ['morning', 'evening'], category: 'comfort' },
] as const satisfies readonly IconOption[];

export const TASK_LIBRARY = [
  { id: 'use-toilet', title: 'Use the toilet', icon: 'sparkles', routines: ['morning', 'evening'], ages: ['2-4', '4-6', '6-8'], category: 'self-care', featured: true },
  { id: 'make-bed', title: 'Make bed', icon: 'bed', routines: ['morning'], ages: ['4-6', '6-8'], category: 'reset', featured: true },
  { id: 'brush-teeth', title: 'Brush teeth', icon: 'brush', routines: ['morning', 'evening'], ages: ['2-4', '4-6', '6-8'], category: 'self-care', featured: true },
  { id: 'get-dressed', title: 'Get dressed', icon: 'shirt', routines: ['morning'], ages: ['2-4', '4-6', '6-8'], category: 'prep', featured: true },
  { id: 'comb-hair', title: 'Comb hair', icon: 'scissors', routines: ['morning', 'evening'], ages: ['4-6', '6-8'], category: 'self-care' },
  { id: 'eat-breakfast', title: 'Eat breakfast', icon: 'utensils', routines: ['morning'], ages: ['2-4', '4-6', '6-8'], category: 'meal', featured: true },
  { id: 'put-on-shoes', title: 'Put on shoes', icon: 'footprints', routines: ['morning'], ages: ['2-4', '4-6'], category: 'prep', featured: true },
  { id: 'wash-hands', title: 'Wash hands', icon: 'hand', routines: ['morning', 'evening'], ages: ['2-4', '4-6', '6-8'], category: 'self-care' },
  { id: 'pack-backpack', title: 'Pack backpack', icon: 'backpack', routines: ['morning'], ages: ['4-6', '6-8'], category: 'prep' },
  { id: 'put-pajamas-away', title: 'Put pajamas away', icon: 'shirt', routines: ['morning'], ages: ['4-6', '6-8'], category: 'reset' },
  { id: 'fill-water-bottle', title: 'Fill water bottle', icon: 'sparkles', routines: ['morning'], ages: ['4-6', '6-8'], category: 'prep' },
  { id: 'put-dish-away', title: 'Put dish away', icon: 'utensils', routines: ['morning', 'evening'], ages: ['2-4', '4-6'], category: 'meal' },
  { id: 'put-clothes-in-hamper', title: 'Put clothes in hamper', icon: 'shirt', routines: ['evening'], ages: ['4-6', '6-8'], category: 'reset' },
  { id: 'choose-tomorrow-clothes', title: 'Choose tomorrow clothes', icon: 'shirt', routines: ['evening'], ages: ['4-6', '6-8'], category: 'prep' },
  { id: 'finish-dinner', title: 'Finish dinner', icon: 'utensils', routines: ['evening'], ages: ['2-4', '4-6', '6-8'], category: 'meal', featured: true },
  { id: 'put-on-pajamas', title: 'Put on pajamas', icon: 'shirt', routines: ['evening'], ages: ['2-4', '4-6', '6-8'], category: 'wind-down', featured: true },
  { id: 'tidy-room', title: 'Tidy room', icon: 'sparkles', routines: ['evening'], ages: ['2-4', '4-6', '6-8'], category: 'reset', featured: true },
  { id: 'take-bath', title: 'Take a bath', icon: 'bath', routines: ['evening'], ages: ['2-4', '4-6', '6-8'], category: 'self-care' },
  { id: 'read-a-book', title: 'Read a book', icon: 'book-open', routines: ['evening'], ages: ['2-4', '4-6', '6-8'], category: 'wind-down' },
  { id: 'listen-to-music', title: 'Listen to music', icon: 'music', routines: ['morning', 'evening'], ages: ['2-4', '4-6'], category: 'comfort' },
  { id: 'go-to-bed', title: 'Go to bed', icon: 'moon-star', routines: ['evening'], ages: ['2-4', '4-6', '6-8'], category: 'wind-down', featured: true },
  { id: 'unload-dishwasher', title: 'Unload dishwasher', icon: 'chef-hat', routines: ['morning', 'evening'], ages: ['6-8'], category: 'meal' },
  { id: 'fold-clothes', title: 'Fold clothes', icon: 'shirt', routines: ['evening'], ages: ['6-8'], category: 'reset' },
  { id: 'hang-clothes-to-dry', title: 'Hang clothes to dry', icon: 'shirt', routines: ['evening'], ages: ['6-8'], category: 'reset' },
  { id: 'help-sibling-homework', title: 'Help sibling with homework', icon: 'book-open', routines: ['evening'], ages: ['6-8'], category: 'comfort' },
  { id: 'put-dishes-away', title: 'Put dishes away', icon: 'package-open', routines: ['evening'], ages: ['6-8'], category: 'meal' },
] as const satisfies readonly TaskCatalogItem[];

const hasRoutine = (task: TaskCatalogItem, routine: RoutineType) =>
  task.routines.some((value) => value === routine);

export const TASK_CATALOG: Record<RoutineType, readonly TaskCatalogItem[]> = {
  morning: TASK_LIBRARY.filter((task) => hasRoutine(task, 'morning')),
  evening: TASK_LIBRARY.filter((task) => hasRoutine(task, 'evening')),
};

export const TASK_CATALOG_BY_ID = Object.fromEntries(
  TASK_LIBRARY.map((task) => [task.id, task])
) as Record<string, TaskCatalogItem>;

export const groupTasksByAge = (tasks: readonly TaskCatalogItem[]) =>
  AGE_BUCKETS.map((bucket) => ({
    ...bucket,
    tasks: tasks.filter((task) => task.ages.includes(bucket.key)),
  })).filter((bucket) => bucket.tasks.length > 0);

const createTask = (id: string, title: string, icon: IconKey): Task => ({
  id,
  title,
  icon,
  completed: false,
});

const createRoutineTasks = (entries: readonly [id: string, templateId: keyof typeof TASK_CATALOG_BY_ID][]) =>
  entries.map(([id, templateId]) => {
    const template = TASK_CATALOG_BY_ID[templateId];

    return createTask(id, template.title, template.icon);
  });

const createChild = (
  id: string,
  name: string,
  morning: readonly [id: string, templateId: keyof typeof TASK_CATALOG_BY_ID][],
  evening: readonly [id: string, templateId: keyof typeof TASK_CATALOG_BY_ID][]
): Child => ({
  id,
  name,
  age: 5,
  ageBucket: '4-6',
  avatarSeed: id,
  avatarAnimal: undefined,
  schedule: {
    morning: { start: '07:00', end: '09:00' },
    evening: { start: '17:00', end: '20:00' },
  },
  morning: createRoutineTasks(morning),
  evening: createRoutineTasks(evening),
});

export const DEFAULT_CHILDREN: Child[] = [
  createChild('1', 'Lily', [
    ['m1', 'make-bed'],
    ['m2', 'brush-teeth'],
    ['m3', 'get-dressed'],
    ['m4', 'comb-hair'],
    ['m5', 'eat-breakfast'],
    ['m6', 'put-on-shoes'],
  ], [
    ['e1', 'finish-dinner'],
    ['e2', 'put-on-pajamas'],
    ['e3', 'brush-teeth'],
    ['e4', 'comb-hair'],
    ['e5', 'tidy-room'],
    ['e6', 'go-to-bed'],
  ]),
  createChild('2', 'Mila', [
    ['mm1', 'make-bed'],
    ['mm2', 'brush-teeth'],
    ['mm3', 'get-dressed'],
    ['mm4', 'eat-breakfast'],
    ['mm5', 'put-on-shoes'],
  ], [
    ['me1', 'finish-dinner'],
    ['me2', 'put-on-pajamas'],
    ['me3', 'brush-teeth'],
    ['me4', 'go-to-bed'],
  ]),
  createChild('3', 'Ellie', [
    ['em1', 'make-bed'],
    ['em2', 'brush-teeth'],
    ['em3', 'get-dressed'],
    ['em4', 'comb-hair'],
    ['em5', 'eat-breakfast'],
  ], [
    ['ee1', 'finish-dinner'],
    ['ee2', 'put-on-pajamas'],
    ['ee3', 'brush-teeth'],
    ['ee4', 'tidy-room'],
    ['ee5', 'go-to-bed'],
  ]),
];
