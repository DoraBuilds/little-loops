export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const createMemoryStorage = (): StorageLike => {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
};

const memoryStoresByKey = new Map<string, StorageLike>();

const isLocalStorageWritable = (testKey: string) => {
  if (typeof window === 'undefined') return false;
  if (!('localStorage' in window)) return false;

  try {
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    // iOS Safari Private mode and some embedded browsers can throw on setItem.
    return false;
  }
};

/**
 * Returns `localStorage` when available and writable; otherwise returns an
 * in-memory fallback. This prevents app/auth initialization from getting stuck
 * in environments where `localStorage` exists but rejects writes.
 */
export const getSafeStorage = (testKey = '__little_loops_storage_test__'): StorageLike => {
  if (isLocalStorageWritable(testKey)) {
    return window.localStorage;
  }

  const existing = memoryStoresByKey.get(testKey);
  if (existing) return existing;

  const created = createMemoryStorage();
  memoryStoresByKey.set(testKey, created);
  return created;
};
