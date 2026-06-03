import { getSafeStorage } from '@/lib/storage/safe-storage';

/**
 * Supabase auth storage must not assume `localStorage` is writable (iOS Safari
 * Private mode can throw on writes). When storage is not writable, fall back to
 * in-memory storage for the current session so auth can complete.
 */
export const createSupabaseAuthStorage = () => getSafeStorage('__little_loops_supabase_auth_storage_test__');

