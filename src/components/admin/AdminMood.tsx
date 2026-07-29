import { AdminBar } from './AdminBar';
import { WEEK_DAYS } from '@/lib/mascots';
import type { Child } from '@/lib/types';

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

interface AdminMoodProps {
  kid: Child;
  onBack: () => void;
}

export const AdminMood = ({ kid, onBack }: AdminMoodProps) => {
  const moods = kid.moods ?? WEEK_DAYS.map((day) => ({ day, emoji: null, note: null }));

  return (
    <div
      style={{
        height: '100%',
        background: '#fff9f0',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: INK,
        overflowY: 'auto',
      }}
    >
      <AdminBar sub={`${kid.name}'s setup`} title="Mood" onBack={onBack} />

      {/* Week preview */}
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: INK_MUTE, marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          This week's moods
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 12, border: '1.5px solid rgba(180,120,80,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
            {moods.map((m, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '8px 0',
                  background: '#fff9f0',
                  borderRadius: 12,
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: 22, opacity: m.emoji ? 1 : 0.25 }}>{m.emoji ?? '·'}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: INK_MUTE, marginTop: 2 }}>{m.day}</div>
                {m.note && (
                  <div style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: '#a855f7' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes from this week */}
      {moods.some((m) => m.note) && (
        <div style={{ padding: '12px 14px 0' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: INK_MUTE, marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            📝 {kid.name}'s notes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {moods.filter((m) => m.note).map((m, i) => (
              <div key={i} style={{ background: '#faf5ff', borderRadius: 14, padding: '12px 14px', border: '1.5px solid rgba(168,85,247,0.12)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#a855f7', marginBottom: 4 }}>
                  {m.emoji} {m.day}
                </div>
                <div style={{ fontSize: 14, color: INK, fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{m.note}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights card */}
      <div style={{ padding: '12px 14px 24px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg,#e9defc,#ddd6fe)',
            borderRadius: 16,
            padding: 16,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 24 }}>💜</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#5b21b6' }}>
              This week's pattern
            </div>
            <div style={{ fontSize: 13, color: '#6d28d9', marginTop: 4, lineHeight: 1.5 }}>
              Keep tracking daily moods — insights will appear here over time. 🌸
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
