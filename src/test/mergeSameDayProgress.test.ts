import { describe, expect, it } from 'vitest';
import { mergeTodaysCompletions } from '@/lib/data/merge-same-day-progress';
import type { Child } from '@/lib/types';

const buildChild = (overrides: Partial<Child> = {}): Child => ({
  id: 'child-1',
  name: 'Lily',
  morning: [
    { id: 'm1', title: 'Make bed', icon: 'bed', completed: false },
    { id: 'm2', title: 'Brush teeth', icon: 'brush', completed: false },
  ],
  evening: [],
  ...overrides,
});

describe('mergeTodaysCompletions', () => {
  it('keeps a task completed locally even when cloud has not caught up yet', () => {
    const cloud = [buildChild()]; // m1 not completed in cloud (write never landed)
    const local = [
      buildChild({
        morning: [
          { id: 'm1', title: 'Make bed', icon: 'bed', completed: true },
          { id: 'm2', title: 'Brush teeth', icon: 'brush', completed: false },
        ],
      }),
    ];

    const merged = mergeTodaysCompletions(cloud, local);

    expect(merged[0].morning.find((t) => t.id === 'm1')?.completed).toBe(true);
    expect(merged[0].morning.find((t) => t.id === 'm2')?.completed).toBe(false);
  });

  it('keeps a task completed in cloud even when local has not caught up yet', () => {
    const cloud = [
      buildChild({
        morning: [
          { id: 'm1', title: 'Make bed', icon: 'bed', completed: true },
          { id: 'm2', title: 'Brush teeth', icon: 'brush', completed: false },
        ],
      }),
    ];
    const local = [buildChild()]; // both incomplete locally (e.g. completed on another device)

    const merged = mergeTodaysCompletions(cloud, local);

    expect(merged[0].morning.find((t) => t.id === 'm1')?.completed).toBe(true);
  });

  it('leaves both incomplete when neither source has completed it', () => {
    const cloud = [buildChild()];
    const local = [buildChild()];

    const merged = mergeTodaysCompletions(cloud, local);

    expect(merged[0].morning.every((t) => !t.completed)).toBe(true);
  });

  it('is a no-op for a child that only exists in cloud (new/removed on another device)', () => {
    const cloud = [buildChild({ id: 'child-2', name: 'New Kid' })];
    const local = [buildChild()]; // different child id, no match

    const merged = mergeTodaysCompletions(cloud, local);

    expect(merged).toEqual(cloud);
  });

  it('ignores a local task that no longer exists in the cloud routine structure', () => {
    const cloud = [buildChild({ morning: [{ id: 'm1', title: 'Make bed', icon: 'bed', completed: false }] })];
    const local = [
      buildChild({
        morning: [
          { id: 'm1', title: 'Make bed', icon: 'bed', completed: false },
          { id: 'm-removed', title: 'Old task', icon: 'star', completed: true },
        ],
      }),
    ];

    const merged = mergeTodaysCompletions(cloud, local);

    expect(merged[0].morning).toHaveLength(1);
    expect(merged[0].morning[0].completed).toBe(false);
  });

  it('merges evening tasks the same way as morning', () => {
    const cloud = [
      buildChild({ evening: [{ id: 'e1', title: 'Pajamas', icon: 'moon-star', completed: false }] }),
    ];
    const local = [
      buildChild({ evening: [{ id: 'e1', title: 'Pajamas', icon: 'moon-star', completed: true }] }),
    ];

    const merged = mergeTodaysCompletions(cloud, local);

    expect(merged[0].evening[0].completed).toBe(true);
  });
});
