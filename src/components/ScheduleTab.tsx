import { useEffect, useMemo, useState } from 'react';
import { PainterlyBanner } from './PainterlyBanner';
import { getMascot } from '@/lib/mascots';
import {
  getTodaySummerDay,
  SUMMER_DAYS,
  SUMMER_SCHEDULE,
  timeToMinutes,
  type SummerDay,
} from '@/lib/summer-schedule';
import type { Child } from '@/lib/types';

interface ScheduleTabProps {
  kid: Child;
}

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';
const BLUE = '#0ea5e9';

export const ScheduleTab = ({ kid }: ScheduleTabProps) => {
  const [selectedDay, setSelectedDay] = useState<SummerDay>(() => getTodaySummerDay());
  const [now, setNow] = useState(() => new Date());
  const mascot = getMascot(kid.mascotId ?? kid.avatarAnimal);
  const today = getTodaySummerDay(now);
  const items = SUMMER_SCHEDULE[selectedDay];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const timing = useMemo(() => {
    if (selectedDay !== today || now.getDay() === 0 || now.getDay() === 6) {
      return { currentIndex: -1, nextIndex: -1 };
    }

    const minutes = now.getHours() * 60 + now.getMinutes();
    const nextIndex = items.findIndex((item) => timeToMinutes(item.time) > minutes);
    const currentIndex = nextIndex === 0 ? -1 : nextIndex === -1 ? items.length - 1 : nextIndex - 1;
    return { currentIndex, nextIndex };
  }, [items, now, selectedDay, today]);

  const current = timing.currentIndex >= 0 ? items[timing.currentIndex] : null;
  const next = timing.nextIndex >= 0 ? items[timing.nextIndex] : null;

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        paddingBottom: 88,
        background: 'linear-gradient(180deg,#fff9f0 0%,#e0f2fe 100%)',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: INK,
      }}
    >
      <PainterlyBanner label={`${mascot.emoji} ${kid.name}'s`} title="Summer Schedule" palette="purple" />

      <div style={{ padding: '0 14px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
          {SUMMER_DAYS.map((day) => {
            const selected = day === selectedDay;
            const isToday = day === today && now.getDay() >= 1 && now.getDay() <= 5;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                aria-pressed={selected}
                style={{
                  border: selected ? `2px solid ${BLUE}` : '1.5px solid rgba(14,165,233,0.14)',
                  background: selected ? '#e0f2fe' : '#fff',
                  borderRadius: 14,
                  padding: '9px 2px 7px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: selected ? '#0369a1' : INK_MUTE,
                  boxShadow: selected ? '0 4px 12px rgba(14,165,233,0.15)' : 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800 }}>{day.slice(0, 3).toUpperCase()}</div>
                <div style={{ fontSize: 12, height: 14, marginTop: 2 }}>{isToday ? '●' : '·'}</div>
              </button>
            );
          })}
        </div>

        {selectedDay === today && now.getDay() >= 1 && now.getDay() <= 5 && (
          <div
            style={{
              marginTop: 12,
              borderRadius: 18,
              background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
              color: '#fff',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 6px 16px rgba(14,165,233,0.2)',
            }}
          >
            <div style={{ fontSize: 28 }}>{current?.icon ?? '☀️'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.78, letterSpacing: '0.1em' }}>
                {current ? 'NOW' : 'COMING UP'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 1 }}>
                {current?.title ?? next?.title ?? 'Enjoy your morning'}
              </div>
              {next && (
                <div style={{ fontSize: 11, opacity: 0.82, marginTop: 2 }}>
                  Next: {next.title} at {next.time}
                </div>
              )}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 14,
            background: '#fff',
            borderRadius: 22,
            padding: '12px 10px',
            border: '1.5px solid rgba(14,165,233,0.1)',
            boxShadow: '0 5px 16px rgba(14,165,233,0.08)',
          }}
        >
          <div
            style={{
              padding: '0 8px 9px',
              fontSize: 11,
              fontWeight: 800,
              color: '#0369a1',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {selectedDay}'s timetable
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {items.map((item, index) => {
              const isCurrent = index === timing.currentIndex;
              return (
                <div
                  key={`${item.time}-${item.title}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '54px 1fr',
                    gap: 8,
                    alignItems: 'stretch',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      color: isCurrent ? '#0369a1' : INK_MUTE,
                    }}
                  >
                    {item.time}
                  </div>
                  <div
                    style={{
                      borderRadius: 15,
                      padding: '10px 12px',
                      background: isCurrent ? '#bae6fd' : index % 2 === 0 ? '#f0f9ff' : '#fff9f0',
                      border: isCurrent ? `2px solid ${BLUE}` : '1.5px solid rgba(180,120,80,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <div style={{ fontSize: 23, width: 30, textAlign: 'center', flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</div>
                      {item.note && (
                        <div style={{ fontSize: 10, color: INK_MUTE, marginTop: 2, lineHeight: 1.3 }}>{item.note}</div>
                      )}
                    </div>
                    {isCurrent && (
                      <div
                        style={{
                          borderRadius: 99,
                          background: BLUE,
                          color: '#fff',
                          padding: '3px 7px',
                          fontSize: 9,
                          fontWeight: 800,
                        }}
                      >
                        NOW
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
