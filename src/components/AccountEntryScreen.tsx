import { ArrowLeft } from 'lucide-react';
import { AccountSettingsCard } from './AccountSettingsCard';

const T = {
  fonts: `'Fredoka', system-ui, sans-serif`,
  ink: '#3d2c1f',
  inkMute: '#8a7866',
  cream: '#fff9f0',
  white: '#ffffff',
  border: 'rgba(180,120,80,0.10)',
  orange: '#f97316',
  orangeLight: '#fff1e8',
};

interface Props {
  onBack?: () => void;
}

export const AccountEntryScreen = ({ onBack }: Props) => (
  <div
    style={{
      minHeight: '100svh',
      background: T.cream,
      fontFamily: T.fonts,
      color: T.ink,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px 60px',
      position: 'relative',
      overflowX: 'hidden',
    }}
  >
    {/* Blobs */}
    <div style={{ position: 'fixed', top: -80, left: '50%', transform: 'translateX(-50%)', width: 500, height: 340, borderRadius: '50%', background: 'rgba(249,115,22,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
    <div style={{ position: 'fixed', bottom: -60, right: -40, width: 300, height: 300, borderRadius: '50%', background: 'rgba(67,56,202,0.07)', filter: 'blur(60px)', pointerEvents: 'none' }} />

    {/* Back link */}
    {onBack && (
      <button
        onClick={onBack}
        style={{
          position: 'absolute', top: 20, left: 20,
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: T.fonts, fontSize: 14, fontWeight: 700,
          color: T.inkMute, display: 'flex', alignItems: 'center', gap: 5,
          padding: '6px 10px', borderRadius: 10,
          transition: 'color 150ms ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = T.orange; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = T.inkMute; }}
      >
        <ArrowLeft size={15} />
        Back
      </button>
    )}

    {/* Logo / wordmark */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, position: 'relative' }}>
      <svg width="64" height="64" viewBox="0 0 200 200" style={{ marginBottom: 14 }} aria-hidden="true">
        <defs>
          <linearGradient id="ll-acct-g" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A693CC" />
            <stop offset="1" stopColor="#8AAF98" />
          </linearGradient>
        </defs>
        <path d="M100,28 C140,28 172,60 172,100 C172,144 136,172 100,172 C60,172 32,138 32,100 C32,66 58,44 88,47 C113,49.5 128,72 121,96 C116,113 98,120 88,110" fill="none" stroke="url(#ll-acct-g)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ fontSize: 26, fontWeight: 700, fontFamily: `'Comfortaa', 'Fredoka', system-ui, sans-serif` }}>
        <span style={{ color: '#3C3347' }}>Little</span>
        <span style={{ color: '#866CB3' }}> Loops</span>
      </div>
      <div style={{ fontSize: 14, color: T.inkMute, marginTop: 4 }}>Parent account</div>
    </div>

    {/* Sign-in card */}
    <div style={{ width: '100%', maxWidth: 440 }}>
      <AccountSettingsCard />
    </div>
  </div>
);
