import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveHouseholdConfigToCloud } from '@/lib/data/cloud-household-write';

const {
  getSupabaseClient,
  updateHomeScene,
  listChildProfiles,
  removeChildProfile,
  upsertChildProfile,
  upsertRoutine,
  replaceRoutineTasks,
} = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
  updateHomeScene: vi.fn(),
  listChildProfiles: vi.fn(),
  removeChildProfile: vi.fn(),
  upsertChildProfile: vi.fn(),
  upsertRoutine: vi.fn(),
  replaceRoutineTasks: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient,
}));

vi.mock('@/lib/data/supabase-household-repository', () => ({
  SupabaseHouseholdRepository: class {
    updateHomeScene = updateHomeScene;
  },
}));

vi.mock('@/lib/data/supabase-child-profile-repository', () => ({
  SupabaseChildProfileRepository: class {
    listByHousehold = listChildProfiles;
    remove = removeChildProfile;
    upsert = upsertChildProfile;
  },
}));

vi.mock('@/lib/data/supabase-routine-repository', () => ({
  SupabaseRoutineRepository: class {
    upsertRoutine = upsertRoutine;
    replaceRoutineTasks = replaceRoutineTasks;
  },
}));

describe('saveHouseholdConfigToCloud', () => {
  beforeEach(() => {
    getSupabaseClient.mockReturnValue({});
    updateHomeScene.mockReset();
    listChildProfiles.mockReset();
    removeChildProfile.mockReset();
    upsertChildProfile.mockReset();
    upsertRoutine.mockReset();
    replaceRoutineTasks.mockReset();
    updateHomeScene.mockResolvedValue(undefined);
    listChildProfiles.mockResolvedValue([]);
    upsertChildProfile.mockResolvedValue({
      id: 'child-1',
    });
    upsertRoutine
      .mockResolvedValueOnce({ id: 'child-1-morning' })
      .mockResolvedValueOnce({ id: 'child-1-evening' });
    replaceRoutineTasks.mockResolvedValue([]);
  });

  it('writes household scene, children, routines, and tasks to the cloud household', async () => {
    await saveHouseholdConfigToCloud({
      household: {
        id: 'house-1',
        name: 'Little Loops Family',
        timezone: 'Europe/Madrid',
        homeScene: 'bike',
        createdByUserId: 'user-1',
        createdAt: '2026-04-20T10:00:00Z',
        updatedAt: '2026-04-20T10:00:00Z',
      },
      homeScene: 'school',
      children: [
        {
          id: 'child-1',
          name: 'Lily',
          age: 5,
          ageBucket: '4-6',
          avatarAnimal: 'cat',
          avatarSeed: 'seed-1',
          schedule: {
            morning: { start: '07:30', end: '08:30' },
            evening: { start: '18:00', end: '19:30' },
          },
          morning: [
            { id: 'm1', title: 'Brush teeth', icon: 'brush', completed: true },
            { id: 'm2', title: 'Water plant', icon: 'sparkles', completed: false },
          ],
          evening: [{ id: 'e1', title: 'Go to bed', icon: 'moon-star', completed: false }],
        },
      ],
      removeMissingChildren: true,
    });

    expect(updateHomeScene).toHaveBeenCalledWith('house-1', 'school');
    expect(listChildProfiles).toHaveBeenCalledWith('house-1');
    expect(upsertChildProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'child-1',
        householdId: 'house-1',
        name: 'Lily',
      })
    );
    expect(upsertRoutine).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        childProfileId: 'child-1',
        type: 'morning',
        startTime: '07:30',
        endTime: '08:30',
      })
    );
    expect(replaceRoutineTasks).toHaveBeenNthCalledWith(1, {
      routineId: 'child-1-morning',
      tasks: [
        {
          taskTemplateId: 'brush-teeth',
          customTitle: null,
          customIcon: null,
          sortOrder: 0,
          isArchived: false,
        },
        {
          taskTemplateId: null,
          customTitle: 'Water plant',
          customIcon: 'sparkles',
          sortOrder: 1,
          isArchived: false,
        },
      ],
    });
  });

  it('removes cloud children that no longer exist locally when requested', async () => {
    listChildProfiles.mockResolvedValue([
      { id: 'child-stale' },
      { id: 'child-1' },
    ]);

    await saveHouseholdConfigToCloud({
      household: {
        id: 'house-1',
        name: 'Little Loops Family',
        timezone: 'Europe/Madrid',
        homeScene: 'bike',
        createdByUserId: 'user-1',
        createdAt: '2026-04-20T10:00:00Z',
        updatedAt: '2026-04-20T10:00:00Z',
      },
      homeScene: 'bike',
      children: [
        {
          id: 'child-1',
          name: 'Lily',
          morning: [],
          evening: [],
        },
      ],
      removeMissingChildren: true,
    });

    expect(removeChildProfile).toHaveBeenCalledWith('child-stale');
  });

  it('annotates the failing cloud save step when child profile upsert fails', async () => {
    upsertChildProfile.mockRejectedValueOnce(new Error('new row violates row-level security policy'));

    await expect(
      saveHouseholdConfigToCloud({
        household: {
          id: 'house-1',
          name: 'Little Loops Family',
          timezone: 'Europe/Madrid',
          homeScene: 'bike',
          createdByUserId: 'user-1',
          createdAt: '2026-04-20T10:00:00Z',
          updatedAt: '2026-04-20T10:00:00Z',
        },
        homeScene: 'school',
        children: [
          {
            id: 'child-1',
            name: 'Mila',
            morning: [],
            evening: [],
          },
        ],
        removeMissingChildren: true,
      })
    ).rejects.toThrow(
      'Upserting child profile "Mila". Failed: new row violates row-level security policy'
    );
  });
});
