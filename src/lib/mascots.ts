// Mascot system for Little Loops — Cozy Pastel redesign

export interface Mascot {
  id: string;
  emoji: string;
  name: string;
  color: string;
  light: string;
}

export interface BadgeEntry {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export interface MoodEntry {
  day: string;
  emoji: string | null;
  note?: string | null;
}

export interface MoodOption {
  emoji: string;
  label: string;
  color: string;
}

export const MASCOTS: Mascot[] = [
  { id: 'frog',    emoji: '🐸', name: 'Hoppy',    color: '#22c55e', light: '#dcfce7' },
  { id: 'bunny',   emoji: '🐰', name: 'Bun',      color: '#ec4899', light: '#fce7f3' },
  { id: 'cat',     emoji: '🐱', name: 'Whiskers', color: '#a855f7', light: '#f3e8ff' },
  { id: 'bear',    emoji: '🐻', name: 'Honey',    color: '#f59e0b', light: '#fef3c7' },
  { id: 'panda',   emoji: '🐼', name: 'Bamboo',   color: '#64748b', light: '#f1f5f9' },
  { id: 'fox',     emoji: '🦊', name: 'Sly',      color: '#ea580c', light: '#fed7aa' },
  { id: 'penguin', emoji: '🐧', name: 'Pip',      color: '#0ea5e9', light: '#dbeafe' },
  { id: 'koala',   emoji: '🐨', name: 'Gum',      color: '#94a3b8', light: '#e2e8f0' },
  { id: 'unicorn', emoji: '🦄', name: 'Sparkle',  color: '#d946ef', light: '#fae8ff' },
  { id: 'owl',     emoji: '🦉', name: 'Hoot',     color: '#7c3aed', light: '#ede9fe' },
];

export function getMascot(id: string | undefined): Mascot {
  return MASCOTS.find((m) => m.id === id) ?? MASCOTS[0];
}

export const BADGE_CATALOG: BadgeEntry[] = [
  { id: 'first-star',    name: 'First Star',      icon: '⭐', desc: 'Finished your first routine' },
  { id: '7-day-streak',  name: '7 Day Streak',    icon: '🔥', desc: '7 days in a row' },
  { id: 'early-bird',    name: 'Early Bird',      icon: '🌅', desc: 'Done before 8am' },
  { id: 'tooth-hero',    name: 'Tooth Hero',      icon: '🦷', desc: 'Brushed 30 days' },
  { id: 'calm-cloud',    name: 'Calm Cloud',      icon: '☁️', desc: '5 calm moods in a row' },
  { id: '30-day-streak', name: '30 Day Streak',   icon: '🏆', desc: '30 days in a row' },
  { id: 'bedtime-boss',  name: 'Bedtime Boss',    icon: '🌙', desc: 'Evening routine 14 days' },
  { id: 'affirm-pro',    name: 'Affirmation Pro', icon: '💫', desc: 'Listened to 50 affirmations' },
];

export const DEFAULT_BADGES: Record<string, boolean> = Object.fromEntries(
  BADGE_CATALOG.map((b) => [b.id, false])
);

export const MOOD_OPTIONS: MoodOption[] = [
  { emoji: '😄', label: 'Great', color: '#22c55e' },
  { emoji: '🙂', label: 'Good',  color: '#84cc16' },
  { emoji: '😐', label: 'Okay',  color: '#eab308' },
  { emoji: '😕', label: 'Meh',   color: '#f97316' },
  { emoji: '😢', label: 'Sad',   color: '#3b82f6' },
  { emoji: '😡', label: 'Mad',   color: '#ef4444' },
];

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const DEFAULT_MOODS: MoodEntry[] = WEEK_DAYS.map((day) => ({ day, emoji: null }));
