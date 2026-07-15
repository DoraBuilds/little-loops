export const SUMMER_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
export type SummerDay = (typeof SUMMER_DAYS)[number];
export type SummerScheduleItem = { id: string; time: string; title: string; icon: string; note?: string };
export type SummerSchedule = Record<SummerDay, SummerScheduleItem[]>;

const item = (time: string, title: string, icon: string, note?: string): SummerScheduleItem => ({
  id: `${time}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  time, title, icon, note,
});
const morning = [item('10:00','Math','🔢','A short challenge for each age'),item('10:30','Reading','📚','Read alone, together, or to Lily'),item('11:00','Creative time','🎨','Drawing, colouring, or making something'),item('12:00','Free play','🧸'),item('13:00','Lunch','🍽️')];
const evening = [item('16:00','Fruit snack','🍎'),item('17:30','Free play','🪁'),item('19:00','Dinner','🍽️'),item('20:00','Evening routine','🌙')];
export const DEFAULT_SUMMER_SCHEDULE: SummerSchedule = {
  Monday:[...morning,item('14:00','Beach','🏖️'),evening[0],item('16:30','Cooking class','👩‍🍳','Help prepare a snack or part of dinner'),...evening.slice(1)],
  Tuesday:[item('09:00','Bakery mission','🥖','Get bread together with a grown-up nearby'),...morning,item('14:00','Pool','🏊'),evening[0],item('16:30','Sewing with Grandma','🧵'),...evening.slice(1)],
  Wednesday:[...morning,item('14:00','Beach','🏖️'),evening[0],item('16:30','Prepare a snack','🥣','Wash, cut, mix, or plate something simple'),...evening.slice(1)],
  Thursday:[item('09:00','Bakery mission','🥖','Get bread together with a grown-up nearby'),...morning,item('14:00','Pool','🏊'),evening[0],item('16:30','Cooking class','👩‍🍳'),...evening.slice(1)],
  Friday:[...morning,item('14:00','Beach or pool','🌊'),evening[0],item('16:30','Prepare the showcase','✨'),item('18:00','Friday showcase','🎤','Share something learned, made, read, or practised'),...evening.slice(2)],
};
const STORAGE_KEY='little-loops-summer-schedule-v1';
export const cloneSummerSchedule=(schedule:SummerSchedule):SummerSchedule=>Object.fromEntries(SUMMER_DAYS.map(day=>[day,schedule[day].map(entry=>({...entry}))])) as SummerSchedule;
export const loadSummerSchedule=():SummerSchedule=>{try{const raw=window.localStorage.getItem(STORAGE_KEY);if(!raw)return cloneSummerSchedule(DEFAULT_SUMMER_SCHEDULE);const parsed=JSON.parse(raw) as Partial<SummerSchedule>;if(!SUMMER_DAYS.every(day=>Array.isArray(parsed[day])))throw new Error('Invalid schedule');return parsed as SummerSchedule;}catch{return cloneSummerSchedule(DEFAULT_SUMMER_SCHEDULE);}};
export const saveSummerSchedule=(schedule:SummerSchedule)=>window.localStorage.setItem(STORAGE_KEY,JSON.stringify(schedule));
export const getTodaySummerDay=(date=new Date()):SummerDay=>date.getDay()>=1&&date.getDay()<=5?SUMMER_DAYS[date.getDay()-1]:'Monday';
export const timeToMinutes=(value:string)=>{const [hours,minutes]=value.split(':').map(Number);return hours*60+minutes;};
