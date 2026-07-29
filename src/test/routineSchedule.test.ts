import { describe, expect, it } from 'vitest';
import { getDueRoutine, getDisplayRoutine, getHouseholdTheme } from '@/lib/routine-schedule';
import type { Child } from '@/lib/types';

const at = (hours: number, minutes = 0) => new Date(2026, 0, 1, hours, minutes, 0);

const buildChild = (overrides: Partial<Child> = {}): Child => ({
  id: 'child-1',
  name: 'Lily',
  morning: [{ id: 'm1', title: 'Make bed', icon: 'bed', completed: false }],
  evening: [{ id: 'e1', title: 'Pajamas', icon: 'moon-star', completed: false }],
  schedule: {
    morning: { start: '07:00', end: '09:00' },
    evening: { start: '17:00', end: '20:00' },
  },
  ...overrides,
});

describe('getDueRoutine', () => {
  it('returns morning when inside the morning window', () => {
    expect(getDueRoutine(buildChild(), at(8, 0))).toBe('morning');
  });

  it('returns evening when inside the evening window', () => {
    expect(getDueRoutine(buildChild(), at(18, 0))).toBe('evening');
  });

  it('returns null between routines', () => {
    expect(getDueRoutine(buildChild(), at(12, 0))).toBeNull();
  });

  it('handles an evening window that wraps past midnight', () => {
    const child = buildChild({ schedule: { morning: { start: '07:00', end: '09:00' }, evening: { start: '20:00', end: '02:00' } } });
    expect(getDueRoutine(child, at(23, 30))).toBe('evening');
    expect(getDueRoutine(child, at(1, 0))).toBe('evening');
    expect(getDueRoutine(child, at(5, 0))).toBeNull();
  });

  it('respects a custom evening window that starts before 5pm', () => {
    // Regression case: a family with young kids running an early bedtime routine.
    const child = buildChild({ schedule: { morning: { start: '07:00', end: '09:00' }, evening: { start: '16:00', end: '19:00' } } });
    expect(getDueRoutine(child, at(16, 15))).toBe('evening');
  });
});

describe('getDisplayRoutine', () => {
  it('honours the due routine when one is active', () => {
    expect(getDisplayRoutine(buildChild(), at(8, 0))).toBe('morning');
    expect(getDisplayRoutine(buildChild(), at(18, 0))).toBe('evening');
  });

  it('falls back to the most recently started routine between windows', () => {
    expect(getDisplayRoutine(buildChild(), at(12, 0))).toBe('morning'); // morning (7-9) started more recently than evening (17-20) at noon
    expect(getDisplayRoutine(buildChild(), at(22, 0))).toBe('evening'); // evening (started 17:00) most recent at 22:00
  });

  it('never shows a routine with zero tasks when the other has tasks', () => {
    const child = buildChild({ evening: [] });
    // At noon the fallback would normally pick morning anyway, so force evening via time.
    expect(getDisplayRoutine(child, at(22, 0))).toBe('morning');
  });
});

describe('getHouseholdTheme', () => {
  it('defaults to morning when there are no children', () => {
    expect(getHouseholdTheme([], at(20, 0))).toBe('morning');
  });

  it('matches a single child\'s due routine', () => {
    expect(getHouseholdTheme([buildChild()], at(8, 0))).toBe('morning');
    expect(getHouseholdTheme([buildChild()], at(18, 0))).toBe('evening');
  });

  it('does not use a hardcoded 5am-5pm boundary — reflects actual schedule instead', () => {
    // Regression case for the reported bug: an evening routine scheduled to
    // start at 4pm (before the old hardcoded 5pm cutoff) must show as evening.
    const child = buildChild({ schedule: { morning: { start: '07:00', end: '09:00' }, evening: { start: '16:00', end: '19:00' } } });
    expect(getHouseholdTheme([child], at(16, 30))).toBe('evening');
  });

  it('prefers morning if any child has morning due, even if another has evening due', () => {
    const morningChild = buildChild({ id: 'a' });
    const eveningChild = buildChild({
      id: 'b',
      schedule: { morning: { start: '05:00', end: '06:00' }, evening: { start: '08:00', end: '09:00' } },
    });
    // At 08:30: child a's morning (7-9) is due, child b's evening (8-9) is due.
    expect(getHouseholdTheme([morningChild, eveningChild], at(8, 30))).toBe('morning');
  });

  it('falls back to display-routine aggregation when nothing is currently due', () => {
    const child = buildChild();
    expect(getHouseholdTheme([child], at(12, 0))).toBe('morning');
    expect(getHouseholdTheme([child], at(22, 0))).toBe('evening');
  });
});
