import { useEffect, useState } from 'react';
import { MascotBubble } from './MascotBubble';
import { BottomNav, type KidTab } from './BottomNav';
import { RoutinesTab } from './RoutinesTab';
import { ScheduleTab } from './ScheduleTab';
import { AffirmationsTab } from './AffirmationsTab';
import { AchievementsTab } from './AchievementsTab';
import { MoodTab } from './MoodTab';
import { NightBackdrop } from './NightBackdrop';
import { MorningBackdrop } from './MorningBackdrop';
import { getMascot } from '@/lib/mascots';
import type { Child, RoutineType } from '@/lib/types';

interface KidAppProps {
  kid: Child;
  theme: 'morning' | 'evening';
  onBack: () => void;
  onToggleTask: (kidId: string, routine: RoutineType, taskId: string) => void;
  onSetMood: (kidId: string, dayIdx: number, emoji: string) => void;
  onSaveNote: (kidId: string, dayIdx: number, note: string) => void;
  onAddAffirmation: (kidId: string, text: string) => void;
  onRemoveAffirmation: (kidId: string, text: string) => void;
}

type KidView = 'hub' | KidTab;

const CATEGORIES: Array<{ id: KidTab; emoji: string; label: string; desc: string; bg: string }> = [
  { id: 'routines', emoji: '📋', label: 'Routines', desc: 'Your daily tasks', bg: 'linear-gradient(145deg,#4338ca,#818cf8)' },
  { id: 'schedule', emoji: '📅', label: 'Schedule', desc: "What's happening today?", bg: 'linear-gradient(145deg,#0284c7,#38bdf8)' },
  { id: 'affirmations', emoji: '💫', label: 'Affirmations', desc: 'You are amazing!', bg: 'linear-gradient(145deg,#c2410c,#fdba74)' },
  { id: 'achievements', emoji: '🏆', label: 'Awards', desc: 'Badges & streaks', bg: 'linear-gradient(145deg,#047857,#6ee7b7)' },
  { id: 'mood', emoji: '😌', label: 'Mood', desc: 'How do you feel?', bg: 'linear-gradient(145deg,#9d174d,#fda4af)' },
];

export const KidApp = ({
  kid,
  theme,
  onBack,
  onToggleTask,
  onSetMood,
  onSaveNote,
  onAddAffirmation,
  onRemoveAffirmation,
}: KidAppProps) => {
  const [view, setView] = useState<KidView>('hub');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const mascot = getMascot(kid.mascotId ?? kid.avatarAnimal);
  const streak = kid.streak ?? 0;
  const isNight = theme === 'evening';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (view === 'hub') {
    return (
      <div style={{ position: 'relative', height: '100dvh', overflow: 'hidden', display: 'flex', justifyContent: 'center', fontFamily: "'Fredoka', system-ui, sans-serif" }}>
        {isNight ? <NightBackdrop /> : <MorningBackdrop />}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 900, height: '100%', display: 'flex', flexDirection: 'column', padding: '20px 20px 28px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexShrink: 0 }}>
            <button type="button" onClick={onBack} aria-label="Back" style={{ width: 38, height: 38, borderRadius: 13, background: isNight ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: isNight ? '#fff' : '#3d2c1f', border: 'none', cursor: 'pointer', boxShadow: isNight ? 'none' : '0 2px 8px rgba(180,120,80,0.12)', fontFamily: 'inherit' }}>‹</button>
            <MascotBubble mascotId={kid.mascotId ?? kid.avatarAnimal} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: isNight ? 'rgba(255,255,255,0.55)' : '#8a7866', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {isNight ? '🌙 Good evening,' : '☀️ Good morning,'}
              </div>
              <div style={{ fontSize: 29, fontWeight: 700, color: isNight ? '#fff' : '#3d2c1f', lineHeight: 1.1, marginTop: 2 }}>
                {kid.name}! {mascot.emoji}
              </div>
            </div>
            {streak > 0 && <div style={{ background: isNight ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9)', borderRadius: 12, padding: '6px 12px', fontSize: 13, fontWeight: 700, color: '#f97316' }}>🔥 {streak}</div>}
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gridAutoRows: 'minmax(135px,1fr)', gap: 12, overflowY: 'auto', alignContent: 'center', paddingBottom: 2 }}>
            {CATEGORIES.map((category, index) => (
              <button key={category.id} type="button" onClick={() => setView(category.id)} style={{ gridColumn: CATEGORIES.length % 2 === 1 && index === CATEGORIES.length - 1 ? '1 / -1' : undefined, width: CATEGORIES.length % 2 === 1 && index === CATEGORIES.length - 1 ? 'calc(50% - 6px)' : undefined, justifySelf: CATEGORIES.length % 2 === 1 && index === CATEGORIES.length - 1 ? 'center' : undefined, background: category.bg, borderRadius: 26, border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 10px', boxShadow: isNight ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.15)', WebkitTapHighlightColor: 'transparent', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: '0 0 auto', height: '50%', background: 'rgba(255,255,255,0.12)', borderRadius: '26px 26px 60% 60%', pointerEvents: 'none' }} />
                <div style={{ fontSize: 45, lineHeight: 1, position: 'relative' }}>{category.emoji}</div>
                <div style={{ fontSize: 21, fontWeight: 700, textAlign: 'center', position: 'relative' }}>{category.label}</div>
                <div style={{ fontSize: 13, opacity: 0.82, textAlign: 'center', position: 'relative' }}>{category.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100dvh', background: isNight ? '#271a6e' : '#f5ede2', display: 'flex', justifyContent: 'center', alignItems: 'stretch', fontFamily: "'Fredoka', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 900, background: isNight ? '#312e81' : '#fff9f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: isNight ? '0 0 60px rgba(0,0,0,0.4)' : '0 0 60px rgba(180,120,80,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: isMobile ? '8px 12px' : '10px 14px', background: isNight ? 'rgba(44,38,120,0.97)' : 'rgba(255,249,240,0.95)', borderBottom: `1px solid ${isNight ? 'rgba(255,255,255,0.06)' : 'rgba(180,120,80,0.07)'}`, flexShrink: 0, zIndex: 10 }}>
          <button type="button" onClick={() => setView('hub')} aria-label="Back to sections" style={{ width: isMobile ? 40 : 34, height: isMobile ? 40 : 34, borderRadius: 12, background: isNight ? 'rgba(255,255,255,0.1)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 20 : 16, color: isNight ? '#fff' : '#3d2c1f', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>‹</button>
          <MascotBubble mascotId={kid.mascotId ?? kid.avatarAnimal} size={isMobile ? 40 : 34} />
          <div style={{ flex: 1, fontSize: isMobile ? 20 : 24, fontWeight: 700, color: isNight ? '#fff' : '#3d2c1f' }}>
            Hi, {kid.name}!
          </div>
          {streak > 0 && <div style={{ borderRadius: 10, padding: '5px 10px', fontSize: 12, fontWeight: 700, color: '#f97316' }}>🔥 {streak}</div>}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>
          {!isMobile && <BottomNav active={view} onChange={setView} theme={theme} placement="side" />}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              {view === 'routines' && <RoutinesTab kid={kid} theme={theme} onToggleTask={onToggleTask} onAllDone={onBack} />}
              {view === 'schedule' && <ScheduleTab kid={kid} />}
              {view === 'affirmations' && <AffirmationsTab kid={kid} onAddFavourite={(text) => onAddAffirmation(kid.id, text)} onRemoveFavourite={(text) => onRemoveAffirmation(kid.id, text)} />}
              {view === 'achievements' && <AchievementsTab kid={kid} />}
              {view === 'mood' && <MoodTab kid={kid} onSetMood={onSetMood} onSaveNote={onSaveNote} />}
            </div>
          </div>
          {isMobile && <BottomNav active={view} onChange={setView} theme={theme} placement="bottom" />}
        </div>
      </div>
    </div>
  );
};