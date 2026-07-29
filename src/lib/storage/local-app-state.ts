import type { Child, HomeScene } from '@/lib/types';
import { getSafeStorage, type StorageLike } from './safe-storage';

export const LOCAL_APP_STATE_STORAGE_KEY = 'little_loops_data';
const LEGACY_STORAGE_KEY = 'routine_stars_data';
export const CURRENT_LOCAL_APP_STATE_VERSION = 1;

type LocalAppStateScope =
  | { userId: string }
  | { householdId: string }
  | { mode: 'anonymous' }
  | undefined;

const getScopedStorageKey = (scope: LocalAppStateScope) => {
  if (!scope) {
    // Backwards-compat: legacy key for older builds.
    return LOCAL_APP_STATE_STORAGE_KEY;
  }

  if ('mode' in scope) {
    return `${LOCAL_APP_STATE_STORAGE_KEY}::anon`;
  }

  if ('householdId' in scope) {
    return `${LOCAL_APP_STATE_STORAGE_KEY}::household:${scope.householdId}`;
  }

  return `${LOCAL_APP_STATE_STORAGE_KEY}::user:${scope.userId}`;
};

export interface LocalAppState {
  version: number;
  children: Child[];
  homeScene: HomeScene;
  lastReset: string;
  setupComplete: boolean;
}

type LegacyLocalAppState = Partial<Omit<LocalAppState, 'version'>> & {
  children?: Child[];
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeLocalAppState = (value: unknown): LocalAppState | null => {
  if (!isObject(value) || !Array.isArray(value.children)) {
    return null;
  }

  const legacy = value as LegacyLocalAppState;

  return {
    version:
      typeof value.version === 'number' && Number.isFinite(value.version)
        ? value.version
        : CURRENT_LOCAL_APP_STATE_VERSION,
    children: legacy.children,
    homeScene: legacy.homeScene ?? 'bike',
    lastReset: legacy.lastReset ?? new Date().toDateString(),
    setupComplete: legacy.setupComplete ?? true,
  };
};

const migrateFromLegacyKey = () => {
  if (typeof window === 'undefined' || !('localStorage' in window)) return;
  const ls = window.localStorage;
  if (ls.getItem(LOCAL_APP_STATE_STORAGE_KEY)) return;
  const toMigrate: string[] = [];
  for (let i = 0; i < ls.length; i++) {
    const key = ls.key(i);
    if (key && (key === LEGACY_STORAGE_KEY || key.startsWith(`${LEGACY_STORAGE_KEY}::`))) {
      toMigrate.push(key);
    }
  }
  for (const oldKey of toMigrate) {
    const value = ls.getItem(oldKey);
    if (value) ls.setItem(`${LOCAL_APP_STATE_STORAGE_KEY}${oldKey.slice(LEGACY_STORAGE_KEY.length)}`, value);
  }
};

const loadBestState = (storage: StorageLike): LocalAppState | null => {
  const candidates: LocalAppState[] = [];
  const tryParse = (raw: string | null) => {
    if (!raw) return;
    try { const p = normalizeLocalAppState(JSON.parse(raw)); if (p) candidates.push(p); } catch { /* ignore */ }
  };
  tryParse(storage.getItem(LOCAL_APP_STATE_STORAGE_KEY));
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && key !== LOCAL_APP_STATE_STORAGE_KEY && key.startsWith(`${LOCAL_APP_STATE_STORAGE_KEY}::`)) {
      tryParse(storage.getItem(key));
    }
  }
  if (!candidates.length) return null;
  const best = candidates.reduce((a, b) => b.children.length > a.children.length ? b : a);
  // Migrate to base key so future loads are direct
  storage.setItem(LOCAL_APP_STATE_STORAGE_KEY, JSON.stringify({ version: CURRENT_LOCAL_APP_STATE_VERSION, ...best }));
  return best;
};

export const loadLocalAppState = (scope?: LocalAppStateScope): LocalAppState | null => {
  migrateFromLegacyKey();
  const storage = getSafeStorage('__little_loops_local_app_state_test__');
  // When no scope given, scan all candidate keys and use the one with most children
  if (!scope) return loadBestState(storage);
  const saved = storage.getItem(getScopedStorageKey(scope));
  if (!saved) return null;
  try {
    return normalizeLocalAppState(JSON.parse(saved));
  } catch {
    return null;
  }
};

export const saveLocalAppState = (state: Omit<LocalAppState, 'version'>, scope?: LocalAppStateScope) => {
  const payload: LocalAppState = {
    version: CURRENT_LOCAL_APP_STATE_VERSION,
    ...state,
  };

  const storage = getSafeStorage('__little_loops_local_app_state_test__');
  storage.setItem(getScopedStorageKey(scope), JSON.stringify(payload));
};

export const clearLocalAppState = (scope?: LocalAppStateScope) => {
  const storage = getSafeStorage('__little_loops_local_app_state_test__');
  // Always clear the legacy key so older builds don't resurrect state.
  storage.removeItem(LOCAL_APP_STATE_STORAGE_KEY);
  storage.removeItem(`${LOCAL_APP_STATE_STORAGE_KEY}::anon`);

  if (scope) {
    storage.removeItem(getScopedStorageKey(scope));
  }
};
