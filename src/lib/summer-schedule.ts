export const SUMMER_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export type SummerDay = (typeof SUMMER_DAYS)[number];

export type SummerScheduleItem = {
  time: string;
  title: string;
  icon: string;
  note?: string;
};

export type SummerSchedule = Record<SummerDay, SummerScheduleItem[]>;

const DAILY_MORNING: SummerScheduleItem[] = [
  { time: '10:00', title: 'Math', icon: '🔢', note: 'A short challenge for each age' },
  { time: '10:30', title: 'Reading', icon: '📚', note: 'Read alone, together, or to Lily' },
  { time: '11:00', title: 'Creative time', icon: '🎨', note: 'Drawing, colouring, or making something' },
  { time: '12:00', title: 'Free play', icon: '🧸' },
  { time: '13:00', title: 'Lunch', icon: '🍽️' },
];

const DAILY_EVENING: SummerScheduleItem[] = [
  { time: '16:00', title: 'Fruit snack', icon: '🍎' },
  { time: '17:30', title: 'Free play', icon: '🪁' },
  { time: '19:00', title: 'Dinner', icon: '🍽️' },
  { time: '20:00', title: 'Evening routine', icon: '🌙' },
];

export const SUMMER_SCHEDULE: SummerSchedule = {
  Monday: [
    ...DAILY_MORNING,
    { time: '14:00', title: 'Beach', icon: '🏖️' },
    ...DAILY_EVENING.slice(0, 1),
    { time: '16:30', title: 'Cooking class', icon: '👩‍🍳', note: 'Help prepare a snack or part of dinner' },
    ...DAILY_EVENING.slice(1),
  ],
  Tuesday: [
    { time: '09:00', title: 'Bakery mission', icon: '🥖', note: 'Get bread together with a grown-up nearby' },
    ...DAILY_MORNING,
    { time: '14:00', title: 'Pool', icon: '🏊' },
    ...DAILY_EVENING.slice(0, 1),
    { time: '16:30', title: 'Sewing with Grandma', icon: '🧵' },
    ...DAILY_EVENING.slice(1),
  ],
  Wednesday: [
    ...DAILY_MORNING,
    { time: '14:00', title: 'Beach', icon: '🏖️' },
    ...DAILY_EVENING.slice(0, 1),
    { time: '16:30', title: 'Prepare a snack', icon: '🥣', note: 'Wash, cut, mix, or plate something simple' },
    ...DAILY_EVENING.slice(1),
  ],
  Thursday: [
    { time: '09:00', title: 'Bakery mission', icon: '🥖', note: 'Get bread together with a grown-up nearby' },
    ...DAILY_MORNING,
    { time: '14:00', title: 'Pool', icon: '🏊' },
    ...DAILY_EVENING.slice(0, 1),
    { time: '16:30', title: 'Cooking class', icon: '👩‍🍳' },
    ...DAILY_EVENING.slice(1),
  ],
  Friday: [
    ...DAILY_MORNING,
    { time: '14:00', title: 'Beach or pool', icon: '🌊' },
    ...DAILY_EVENING.slice(0, 1),
    { time: '16:30', title: 'Prepare the showcase', icon: '✨' },
    { time: '18:00', title: 'Friday showcase', icon: '🎤', note: 'Share something learned, made, read, or practised' },
    ...DAILY_EVENING.slice(2),
  ],
};

export const getTodaySummerDay = (date = new Date()): SummerDay => {
  const day = date.getDay();
  if (day >= 1 && day <= 5) return SUMMER_DAYS[day - 1];
  return 'Monday';
};

export const timeToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};
