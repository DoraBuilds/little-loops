import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseAuthStorage } from './storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseClient: SupabaseClient | null = null;

export const isSupabaseConfigured = () => isConfigured;

export const getSupabaseProjectUrl = () => supabaseUrl;

export const getSupabaseEmailRedirectUrl = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return new URL('auth/callback', window.location.origin + (import.meta.env.BASE_URL || '/')).toString();
};

const isSupportedOtpType = (value: string | null) =>
  value === 'signup' ||
  value === 'invite' ||
  value === 'magiclink' ||
  value === 'recovery' ||
  value === 'email' ||
  value === 'email_change' ||
  value === 'sms' ||
  value === 'phone_change';

const describeAuthLinkError = (parsedUrl: URL) => {
  const errorCode = parsedUrl.searchParams.get('error_code');
  const errorDescription = parsedUrl.searchParams.get('error_description');
  const fallbackError = parsedUrl.searchParams.get('error');

  if (errorCode === 'otp_expired') {
    return 'This sign-in link has expired. Please request a new one.';
  }

  if (errorDescription) {
    return decodeURIComponent(errorDescription.replace(/\+/g, ' '));
  }

  if (fallbackError === 'access_denied') {
    return 'This sign-in link could not be used. Please request a new one.';
  }

  return fallbackError;
};

export const finalizeSupabaseAuthFromUrl = async (url = window.location.href) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { handled: false, error: 'Supabase is not configured yet.' };
  }

  const parsedUrl = new URL(url);
  const hashParams = new URLSearchParams(parsedUrl.hash.startsWith('#') ? parsedUrl.hash.slice(1) : parsedUrl.hash);
  const code = parsedUrl.searchParams.get('code');
  const tokenHash = parsedUrl.searchParams.get('token_hash');
  const otpType = parsedUrl.searchParams.get('type');
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  const authLinkError = describeAuthLinkError(parsedUrl);

  try {
    if (authLinkError) {
      return { handled: true, error: authLinkError };
    }

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        const isVerifierMissing = 'name' in error && error.name === 'AuthPKCECodeVerifierMissingError';
        return {
          handled: true,
          error: isVerifierMissing
            ? 'This sign-in link must be opened in the same browser you used to request it. Please request a new sign-in link.'
            : error.message,
        };
      }

      // Clear auth params from the URL for privacy and to avoid re-processing on refresh.
      window.history.replaceState({}, document.title, parsedUrl.pathname);
      return { handled: true, error: null };
    }

    if (tokenHash && isSupportedOtpType(otpType)) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: otpType,
      } as never);

      if (error) {
        return { handled: true, error: error.message };
      }

      window.history.replaceState({}, document.title, parsedUrl.pathname);
      return { handled: true, error: null };
    }

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        return { handled: true, error: error.message };
      }

      window.history.replaceState({}, document.title, parsedUrl.pathname);
      return { handled: true, error: null };
    }

    return { handled: false, error: null };
  } catch (error) {
    return {
      handled: true,
      error: error instanceof Error ? error.message : 'This sign-in link did not finish cleanly.',
    };
  }
};

export const getSupabaseClient = () => {
  if (!isConfigured) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: createSupabaseAuthStorage(),
        // PKCE puts the auth code in query params (?code=xxx) instead of the URL
        // hash (#access_token=xxx). Email clients and mobile WebViews routinely
        // strip hash fragments before following links, which left new users on
        // a spinner that never resolved. Query params survive every email client.
        flowType: 'pkce',
      },
    });
  }

  return supabaseClient;
};
