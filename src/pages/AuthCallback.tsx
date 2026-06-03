import { LoaderCircle, Star, AlertTriangle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/use-auth';
import { finalizeSupabaseAuthFromUrl } from '@/lib/supabase/client';

const CALLBACK_SLOW_MS = 20000;
const CALLBACK_FAILURE_MS = 60000;

const T = {
  fonts: `'Fredoka', system-ui, sans-serif`,
  ink: '#3d2c1f',
  inkMute: '#8a7866',
  cream: '#fff9f0',
  white: '#ffffff',
  border: 'rgba(180,120,80,0.12)',
  orange: '#f97316',
  orangeLight: '#fff1e8',
  shadow: '0 4px 24px rgba(180,120,80,0.12)',
};

const KNOWN_ERROR_MESSAGES: Record<string, string> = {
  otp_expired: 'This sign-in link expired. Please request a new link and try again.',
  token_expired: 'This sign-in link expired. Please request a new link and try again.',
  access_denied: 'Access was denied. Please try signing in again.',
  unauthorized: 'This sign-in link is no longer valid. Please request a new one.',
  invalid_grant: 'This sign-in link is no longer valid. Please request a new one.',
  email_not_confirmed: 'Please confirm your email address before signing in.',
  user_not_found: 'No account was found for this sign-in link. Please try again.',
  server_error: 'Something went wrong on our end. Please try again in a moment.',
};

const FALLBACK_ERROR = 'This sign-in link did not finish cleanly. Please request a new one.';

const getCallbackErrorFromUrl = () => {
  try {
    const url = new URL(window.location.href);
    const error = url.searchParams.get('error');
    const errorCode = url.searchParams.get('error_code');
    const description = url.searchParams.get('error_description') ?? url.searchParams.get('message');

    if (!error && !errorCode && !description) {
      return null;
    }

    // Log raw params for debugging without exposing them to the user.
    console.error('[auth-callback] url error params', { error, errorCode, description });

    const normalizedCode = (errorCode ?? error ?? '').toLowerCase().replace(/\+/g, '_');
    return KNOWN_ERROR_MESSAGES[normalizedCode] ?? FALLBACK_ERROR;
  } catch {
    return null;
  }
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const { configured, status, householdStatus, error, clearError } = useAuth();
  const [callbackError, setCallbackError] = useState<string | null>(() => getCallbackErrorFromUrl());
  const [takingLongerThanExpected, setTakingLongerThanExpected] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!configured) {
      return;
    }

    let cancelled = false;

    const urlError = getCallbackErrorFromUrl();
    if (urlError) {
      setCallbackError(urlError);
      return () => {
        cancelled = true;
      };
    }

    void finalizeSupabaseAuthFromUrl().then((result) => {
      if (!cancelled && result.error) {
        setCallbackError(result.error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [configured]);

  useEffect(() => {
    if (!configured) {
      return;
    }

    // The callback route should finish quickly: once auth succeeds, route the user
    // into the app and let the main UI show any ongoing cloud bootstrap state.
    // If the bootstrap failed, keep the user here with a clear recovery path.
    if (status === 'signed_in' && householdStatus !== 'error') {
      navigate('/', { replace: true });
    }
  }, [configured, householdStatus, navigate, status]);

  useEffect(() => {
    if (!configured || callbackError || status === 'signed_in') {
      return;
    }

    const slowTimer = window.setTimeout(() => {
      setTakingLongerThanExpected(true);
    }, CALLBACK_SLOW_MS);

    const failureTimer = window.setTimeout(() => {
      setTimedOut(true);
    }, CALLBACK_FAILURE_MS);

    return () => {
      window.clearTimeout(slowTimer);
      window.clearTimeout(failureTimer);
    };
  }, [callbackError, configured, householdStatus, status]);

  const resolvedError = callbackError ?? error;

  const btnPrimary: React.CSSProperties = {
    background: T.orange, color: T.white, border: 'none',
    borderRadius: 99, padding: '12px 24px',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    fontFamily: T.fonts, letterSpacing: '0.01em',
    boxShadow: '0 4px 0 rgba(0,0,0,0.10)',
    transition: 'transform 150ms ease',
  };

  const btnSecondary: React.CSSProperties = {
    background: T.white, color: T.ink,
    border: `1.5px solid ${T.border}`,
    borderRadius: 99, padding: '11px 24px',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    fontFamily: T.fonts,
    transition: 'border-color 150ms ease',
  };

  return (
    <div style={{
      minHeight: '100svh', background: T.cream,
      fontFamily: T.fonts, color: T.ink,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', position: 'relative', overflowX: 'hidden',
    }}>
      {/* Blobs */}
      <div style={{ position: 'fixed', top: -80, left: '50%', transform: 'translateX(-50%)', width: 500, height: 340, borderRadius: '50%', background: 'rgba(249,115,22,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -60, right: -40, width: 300, height: 300, borderRadius: '50%', background: 'rgba(67,56,202,0.07)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 460,
        background: T.white, borderRadius: 28,
        padding: '36px 32px', textAlign: 'center',
        border: `1.5px solid ${T.border}`,
        boxShadow: T.shadow,
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{
          width: 56, height: 56, borderRadius: 18, margin: '0 auto 24px',
          background: 'linear-gradient(135deg,#f97316,#fdba74)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 0 rgba(0,0,0,0.10), 0 10px 24px rgba(249,115,22,0.25)',
        }}>
          <Star size={26} color="#fff" fill="#fff" />
        </div>

        {status === 'signed_in' && householdStatus === 'error' ? (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              One more step
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.25, margin: '0 0 12px' }}>
              We signed you in, but could not open the family space yet
            </h1>
            <p style={{ fontSize: 14, color: T.inkMute, lineHeight: 1.65, marginBottom: 24 }}>
              {resolvedError ?? 'Please try this link again in a moment.'}
            </p>
            <button
              type="button"
              style={btnPrimary}
              onClick={() => { clearError(); navigate('/', { replace: true }); }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; }}
            >
              Continue to Little Loops
            </button>
          </>

        ) : resolvedError || timedOut ? (
          <>
            <div style={{
              width: 48, height: 48, borderRadius: 16, margin: '0 auto 20px',
              background: '#fff5f5', border: '1.5px solid rgba(220,38,38,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={22} color="#dc2626" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              {timedOut ? 'Sign-in timed out' : 'Sign-in link problem'}
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.25, margin: '0 0 12px' }}>
              {timedOut ? 'This device did not finish connecting' : 'This sign-in link did not finish cleanly'}
            </h1>
            <p style={{ fontSize: 14, color: T.inkMute, lineHeight: 1.65, marginBottom: 28 }}>
              {resolvedError ?? 'Please refresh once, or request a new sign-in link if this keeps happening.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                style={btnPrimary}
                onClick={() => { clearError(); navigate('/', { replace: true }); }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; }}
              >
                Back to sign in
              </button>
              <button
                type="button"
                style={btnSecondary}
                onClick={() => { clearError(); setCallbackError(null); setTimedOut(false); window.location.reload(); }}
              >
                Refresh and try again
              </button>
            </div>
          </>

        ) : takingLongerThanExpected ? (
          <>
            <div style={{
              width: 48, height: 48, borderRadius: 16, margin: '0 auto 20px',
              background: T.orangeLight, border: `1.5px solid rgba(249,115,22,0.15)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Clock size={22} color={T.orange} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.orange, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              Still connecting
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.25, margin: '0 0 12px' }}>
              We're still opening your family account
            </h1>
            <p style={{ fontSize: 14, color: T.inkMute, lineHeight: 1.65 }}>
              This can take a little longer on some browsers. If this screen stays for more than a minute, we'll show recovery options.
            </p>
          </>

        ) : (
          <>
            <div style={{
              width: 48, height: 48, borderRadius: 16, margin: '0 auto 20px',
              background: T.orangeLight, border: `1.5px solid rgba(249,115,22,0.15)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LoaderCircle size={22} color={T.orange} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.orange, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              Finishing sign-in
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.25, margin: '0 0 12px' }}>
              Opening your family account
            </h1>
            <p style={{ fontSize: 14, color: T.inkMute, lineHeight: 1.65 }}>
              Please keep this page open for a moment while we connect this device.
            </p>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AuthCallback;
