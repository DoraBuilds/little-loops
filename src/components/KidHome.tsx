import { useRef, useState } from 'react';
import { MascotBubble } from './MascotBubble';
import { MorningBackdrop } from './MorningBackdrop';
import { NightBackdrop } from './NightBackdrop';
import { getMascot } from '@/lib/mascots';
import type { Child } from '@/lib/types';

interface KidHomeProps {
  kids: Child[];
  theme: 'morning' | 'evening';
  onPick: (id: string) => void;
  onParent: () => void;
}

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

const LogoMark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <linearGradient id="kh-llg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#A693CC" />
        <stop offset="1" stopColor="#8AAF98" />
      </linearGradient>
    </defs>
    <path d="M100,28 C140,28 172,60 172,100 C172,144 136,172 100,172 C60,172 32,138 32,100 C32,66 58,44 88,47 C113,49.5 128,72 121,96 C116,113 98,120 88,110" fill="none" stroke="url(#kh-llg)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const KidHome = ({ kids, theme, onPick, onParent }: KidHomeProps) => {
  const isMorning = theme === 'morning';
  const [holdPct, setHoldPct] = useState(0);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    const start = performance.now();
    progRef.current = setInterval(() => {
      const p = Math.min(100, ((performance.now() - start) / 1500) * 100);
      setHoldPct(p);
    }, 16);
    holdRef.current = setTimeout(() => {
      if (progRef.current) clearInterval(progRef.current);
      setHoldPct(0);
      onParent();
    }, 1500);
  };

  const cancelHold = () => {
    if (holdRef.current) clearTimeout(holdRef.current);
    if (progRef.current) clearInterval(progRef.current);
    setHoldPct(0);
  };

  const greeting = isMorning ? 'Good morning,' : 'Good evening,';
  const tagline = isMorning ? 'little stars! ✨' : 'little dreamers 🌙';
  const sub = isMorning ? "Who's ready to shine?" : 'Time to wind down';

  return (
    // Full viewport — centres the card horizontally
    <div
      style={{
        position: 'relative',
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: isMorning ? INK : '#fff',
      }}
    >
      {/* Background fills entire viewport */}
      {isMorning ? <MorningBackdrop /> : <NightBackdrop />}

      {/* Centred content card */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 900,
          padding: '24px 20px 20px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header — centred */}
        <div style={{ marginBottom: 24, flexShrink: 0, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 10 }}>
            <LogoMark size={22} />
            <span style={{ fontSize: 14, fontWeight: 700, color: isMorning ? INK : '#fff', fontFamily: `'Comfortaa', 'Fredoka', system-ui, sans-serif`, letterSpacing: '0.01em' }}>
              <span>Little</span>
              <span style={{ color: '#A693CC' }}> Loops</span>
            </span>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: isMorning ? '#d97706' : '#fde68a',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {isMorning ? '☀️' : '🌙'}{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}{' '}
            {isMorning ? 'morning' : 'evening'}
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 8, lineHeight: 1.15 }}>
            {greeting}
            <br />
            {tagline}
          </div>
          <div
            style={{
              fontSize: 20,
              color: isMorning ? INK_MUTE : 'rgba(255,255,255,0.7)',
              marginTop: 8,
            }}
          >
            {sub}
          </div>
        </div>

        {/* Kid cards — big squares in a responsive grid */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: kids.length === 1 ? '1fr' : 'repeat(2, 1fr)',
            gap: 14,
            alignContent: 'start',
          }}
        >
          {kids.map((k, kidIdx) => {
            const m = getMascot(k.mascotId ?? k.avatarAnimal);
            const tasks = isMorning ? k.morning : k.evening;
            const done = tasks.filter((t) => t.completed).length;
            const total = tasks.length;
            const pct = total ? (done / total) * 100 : 0;
            const streak = k.streak ?? 0;
            const allDone = total > 0 && done === total;
            // Last card in an odd-count list → span both columns and self-centre
            const isLoneLastCard = kids.length % 2 !== 0 && kidIdx === kids.length - 1;

            return (
              <button
                key={k.id}
                onClick={() => onPick(k.id)}
                style={{
                  ...(isLoneLastCard && {
                    gridColumn: '1 / -1',
                    justifySelf: 'center',
                    width: 'calc(50% - 7px)',
                  }),
                  background: isMorning
                    ? 'rgba(255,255,255,0.88)'
                    : 'rgba(255,255,255,0.13)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 28,
                  padding: '22px 16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: isMorning
                    ? '0 8px 24px rgba(180,120,80,0.12)'
                    : '0 8px 28px rgba(0,0,0,0.28)',
                  border:
                    '1.5px solid ' +
                    (allDone
                      ? `${m.color}66`
                      : isMorning
                      ? 'rgba(255,255,255,0.75)'
                      : 'rgba(255,255,255,0.15)'),
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: 'inherit',
                  textAlign: 'center',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* All-done shine overlay */}
                {allDone && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${m.color}12, ${m.light}30)`,
                      borderRadius: 28,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Streak badge */}
                {streak > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: isMorning ? '#fff7ed' : 'rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      padding: '3px 7px',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    🔥{streak}
                  </div>
                )}

                {/* Mascot */}
                <MascotBubble
                  mascotId={k.mascotId ?? k.avatarAnimal}
                  size={72}
                  showStreak={false}
                  streak={streak}
                />

                {/* Name */}
                <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
                  {k.name}
                </div>

                {/* Mascot label */}
                <div
                  style={{
                    fontSize: 20,
                    color: isMorning ? INK_MUTE : 'rgba(255,255,255,0.65)',
                    marginTop: -2,
                  }}
                >
                  {allDone ? '🌟 All done!' : `${done} / ${total} done`}
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: '100%',
                    height: 6,
                    background: isMorning
                      ? 'rgba(0,0,0,0.06)'
                      : 'rgba(255,255,255,0.12)',
                    borderRadius: 99,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: allDone
                        ? `linear-gradient(90deg, ${m.color}, ${m.color}bb)`
                        : m.color,
                      borderRadius: 99,
                      transition: 'width 0.5s',
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Parent gate */}
        <button
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            margin: '18px auto 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isMorning ? INK_MUTE : 'rgba(255,255,255,0.6)',
            fontFamily: 'inherit',
            WebkitTapHighlightColor: 'transparent',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 500 }}>⚙️ Hold to open parent settings</span>
          <div
            style={{
              width: 90,
              height: 4,
              borderRadius: 99,
              background: isMorning
                ? 'rgba(180,120,80,0.15)'
                : 'rgba(255,255,255,0.15)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${holdPct}%`,
                background: '#f97316',
                borderRadius: 99,
                transition: 'width 0.06s linear',
              }}
            />
          </div>
        </button>
      </div>
    </div>
  );
};
