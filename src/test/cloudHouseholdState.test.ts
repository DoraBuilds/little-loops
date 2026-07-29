import { describe, expect, it } from 'vitest';
import { mapCloudHouseholdToChildren } from '@/lib/data/cloud-household-state';

describe('mapCloudHouseholdToChildren', () => {
  it('maps cloud child profiles, routines, and template tasks into app children', () => {
    expect(
      mapCloudHouseholdToChildren({
        childProfiles: [
          {
            id: 'child-1',
            householdId: 'house-1',
            name: 'Lily',
            age: 5,
            ageBucket: '4-6',
            avatarAnimal: 'cat',
            avatarSeed: 'seed-1',
            mascotId: 'bunny',
            streak: 3,
            affirmations: ['I am brave'],
            badges: { 'first-star': true },
            moods: [{ day: 'Mon', emoji: '😊' }],
            taskCompletion: {},
            createdAt: '2026-04-20T10:00:00Z',
            updatedAt: '2026-04-20T10:00:00Z',
          },
        ],
        routinesByChildId: {
          'child-1': {
            routines: [
              {
                id: 'routine-morning',
                childProfileId: 'child-1',
                type: 'morning',
                startTime: '07:30',
                endTime: '08:30',
                createdAt: '2026-04-20T10:00:00Z',
                updatedAt: '2026-04-20T10:00:00Z',
              },
              {
                id: 'routine-evening',
                childProfileId: 'child-1',
                type: 'evening',
                startTime: '18:00',
                endTime: '19:30',
                createdAt: '2026-04-20T10:00:00Z',
                updatedAt: '2026-04-20T10:00:00Z',
              },
            ],
            routineTasks: [
              {
                id: 'task-2',
                routineId: 'routine-morning',
                taskTemplateId: null,
                customTitle: 'Water plant',
                customIcon: 'sparkles',
                sortOrder: 1,
                isArchived: false,
                createdAt: '2026-04-20T10:00:00Z',
                updatedAt: '2026-04-20T10:00:00Z',
              },
              {
                id: 'task-1',
                routineId: 'routine-morning',
                taskTemplateId: 'brush-teeth',
                customTitle: null,
                customIcon: null,
                sortOrder: 0,
                isArchived: false,
                createdAt: '2026-04-20T10:00:00Z',
                updatedAt: '2026-04-20T10:00:00Z',
              },
              {
                id: 'task-3',
                routineId: 'routine-evening',
                taskTemplateId: 'go-to-bed',
                customTitle: null,
                customIcon: null,
                sortOrder: 0,
                isArchived: false,
                createdAt: '2026-04-20T10:00:00Z',
                updatedAt: '2026-04-20T10:00:00Z',
              },
            ],
          },
        },
      })
    ).toEqual([
      {
        id: 'child-1',
        name: 'Lily',
        age: 5,
        ageBucket: '4-6',
        avatarAnimal: 'cat',
        avatarSeed: 'seed-1',
        mascotId: 'bunny',
        streak: 3,
        affirmations: ['I am brave'],
        badges: { 'first-star': true },
        moods: [{ day: 'Mon', emoji: '😊' }],
        schedule: {
          morning: { start: '07:30', end: '08:30' },
          evening: { start: '18:00', end: '19:30' },
        },
        morning: [
          { id: 'task-1', title: 'Brush teeth', icon: 'brush', completed: false },
          { id: 'task-2', title: 'Water plant', icon: 'sparkles', completed: false },
        ],
        evening: [{ id: 'task-3', title: 'Go to bed', icon: 'moon-star', completed: false }],
      },
    ]);
  });
});
