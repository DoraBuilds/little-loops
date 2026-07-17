export const SCHEDULE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type ScheduleDay = (typeof SCHEDULE_DAYS)[number];

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  icon: string;
  note?: string;
};

export type SchedulePlan = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  childIds: string[];
  days: Partial<Record<ScheduleDay, ScheduleItem[]>>;
};

export type HouseholdSchedules = SchedulePlan[];

const item = (time: string, title: string, icon: string, note?: string): ScheduleItem => ({
  id: crypto.randomUUID(),
  time,
  title,
  icon,
  note,
});

const standardMorning = () => [
  item('10:00', 'Math', '🔢', 'A short challenge for each age'),
  item('10:30', 'Reading', '📚', 'Read alone, together, or to Lily'),
  item('11:00', 'Creative time', '🎨', 'Drawing, colouring, or making something'),
  item('12:00', 'Free play', '🧸'),
  item('13:00', 'Lunch', '🍽️'),
];

const standardEvening = () => [
  item('16:00', 'Fruit snack', '🍎'),
  item('17:30', 'Free play', '🪁'),
  item('19:00', 'Dinner', '🍽️'),
  item('20:00', 'Evening routine', '🌙'),
];

export const createCroatiaSummerSchedule = (childIds: string[]): SchedulePlan => ({
  id: crypto.randomUUID(),
  name: 'Summer Croatia',
  description: 'Our weekday rhythm for the six weeks in Croatia.',
  active: true,
  childIds,
  days: {
    Monday: [...standardMorning(), item('14:00', 'Beach', '🏖️'), item('16:00', 'Fruit snack', '🍎'), item('16:30', 'Cooking class', '👩‍🍳'), ...standardEvening().slice(1)],
    Tuesday: [item('09:00', 'Bakery mission', '🥖'), ...standardMorning(), item('14:00', 'Pool', '🏊'), item('16:00', 'Fruit snack', '🍎'), item('16:30', 'Sewing with Grandma', '🧵'), ...standardEvening().slice(1)],
    Wednesday: [...standardMorning(), item('14:00', 'Beach', '🏖️'), item('16:00', 'Fruit snack', '🍎'), item('16:30', 'Prepare a snack', '🥣'), ...standardEvening().slice(1)],
    Thursday: [item('09:00', 'Bakery mission', '🥖'), ...standardMorning(), item('14:00', 'Pool', '🏊'), item('16:00', 'Fruit snack', '🍎'), item('16:30', 'Cooking class', '👩‍🍳'), ...standardEvening().slice(1)],
    Friday: [...standardMorning(), item('14:00', 'Beach or pool', '🌊'), item('16:00', 'Fruit snack', '🍎'), item('16:30', 'Prepare the showcase', '✨'), item('18:00', 'Friday showcase', '🎤'), item('19:00', 'Dinner', '🍽️'), item('20:00', 'Evening routine', '🌙')],
  },
});

export const getScheduleDay = (date = new Date()): ScheduleDay => SCHEDULE_DAYS[(date.getDay() + 6) % 7];
export const timeToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

export const cloneSchedules = (schedules: HouseholdSchedules): HouseholdSchedules =>
  schedules.map((schedule) => ({
    ...schedule,
    childIds: [...schedule.childIds],
    days: Object.fromEntries(
      Object.entries(schedule.days).map(([day, entries]) => [day, entries?.map((entry) => ({ ...entry })) ?? []])
    ) as SchedulePlan['days'],
  }));

export const getActiveScheduleForChild = (schedules: HouseholdSchedules, childId: string) =>
  schedules.find((schedule) => schedule.active && (schedule.childIds.length === 0 || schedule.childIds.includes(childId))) ?? null;
