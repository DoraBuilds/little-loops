import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/use-auth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { SupabaseChildProfileRepository } from '@/lib/data/supabase-child-profile-repository';
import { SupabaseScheduleRepository } from '@/lib/data/supabase-schedule-repository';
import {
  cloneSchedules,
  createCroatiaSummerSchedule,
  SCHEDULE_DAYS,
  timeToMinutes,
  type HouseholdSchedules,
  type ScheduleDay,
  type ScheduleItem,
  type SchedulePlan,
} from '@/lib/summer-schedule';

const ink = '#3d2c1f';
const mute = '#8a7866';
const blue = '#0ea5e9';
const font = "'Fredoka', system-ui, sans-serif";

const input: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '2px solid rgba(14,165,233,.18)',
  borderRadius: 16,
  padding: '14px 16px',
  fontFamily: font,
  fontSize: 20,
  fontWeight: 600,
  color: ink,
  background: '#fff',
};

const button = (background: string, color = '#fff'): CSSProperties => ({
  border: 'none',
  borderRadius: 16,
  padding: '14px 18px',
  background,
  color,
  fontFamily: font,
  fontSize: 18,
  fontWeight: 800,
  cursor: 'pointer',
});

const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : typeof error === 'object' && error !== null && 'message' in error
      ? String(error.message)
      : 'Unknown Supabase error.';

export default function SchedulesPage() {
  const navigate = useNavigate();
  const { household, householdStatus, status: authStatus } = useAuth();
  const [children, setChildren] = useState<Array<{ id: string; name: string }>>([]);
  const [schedules, setSchedules] = useState<HouseholdSchedules>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<ScheduleDay>('Monday');
  const [copyTarget, setCopyTarget] = useState<ScheduleDay>('Tuesday');
  const [taskCopyTargets, setTaskCopyTargets] = useState<Record<string, ScheduleDay>>({});
  const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'saved' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [childWarning, setChildWarning] = useState<string | null>(null);

  const selected = useMemo(
    () => schedules.find((schedule) => schedule.id === selectedId) ?? null,
    [schedules, selectedId]
  );

  useEffect(() => {
    if (authStatus === 'loading' || householdStatus === 'idle' || householdStatus === 'loading') {
      setStatus('loading');
      return;
    }

    const supabase = getSupabaseClient();
    if (!household || !supabase) {
      setError('Your signed-in household could not be loaded. Please return to the app and sign in again.');
      setStatus('error');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setError(null);
    setChildWarning(null);

    const scheduleRepo = new SupabaseScheduleRepository(supabase);
    const childRepo = new SupabaseChildProfileRepository(supabase);

    void scheduleRepo.load(household.id).then((loaded) => {
      if (cancelled) return;
      setSchedules(loaded);
      setSelectedId(loaded[0]?.id ?? null);
      setStatus('idle');
    }).catch((loadError) => {
      if (cancelled) return;
      console.error('Could not load schedules', loadError);
      setError(errorMessage(loadError));
      setStatus('error');
    });

    void childRepo.listByHousehold(household.id).then((profiles) => {
      if (cancelled) return;
      setChildren(profiles.map((child) => ({ id: child.id, name: child.name })));
    }).catch((childError) => {
      if (cancelled) return;
      console.error('Could not load child profiles for schedules', childError);
      setChildWarning(`Schedules loaded, but child assignments are temporarily unavailable: ${errorMessage(childError)}`);
    });

    return () => { cancelled = true; };
  }, [authStatus, household, householdStatus]);

  useEffect(() => {
    const next = SCHEDULE_DAYS.find((day) => day !== selectedDay) ?? 'Monday';
    setCopyTarget(next);
    setTaskCopyTargets({});
  }, [selectedDay]);

  const updatePlan = (patch: Partial<SchedulePlan>) =>
    setSchedules((previous) =>
      previous.map((schedule) => (schedule.id === selectedId ? { ...schedule, ...patch } : schedule))
    );

  const updateItems = (items: ScheduleItem[]) => {
    if (!selected) return;
    updatePlan({ days: { ...selected.days, [selectedDay]: items } });
  };

  const createPlan = () => {
    const plan = createCroatiaSummerSchedule(children.map((child) => child.id));
    setSchedules((previous) => [...previous, plan]);
    setSelectedId(plan.id);
  };

  const addItem = () =>
    updateItems([
      ...(selected?.days[selectedDay] ?? []),
      { id: crypto.randomUUID(), time: '15:00', title: 'New activity', icon: '⭐' },
    ]);

  const copyDay = () => {
    if (!selected || copyTarget === selectedDay) return;
    const copied = (selected.days[selectedDay] ?? []).map((item) => ({ ...item, id: crypto.randomUUID() }));
    updatePlan({ days: { ...selected.days, [copyTarget]: copied } });
    setSelectedDay(copyTarget);
  };

  const copyTask = (entry: ScheduleItem) => {
    if (!selected) return;
    const target = taskCopyTargets[entry.id] ?? SCHEDULE_DAYS.find((day) => day !== selectedDay) ?? 'Monday';
    if (target === selectedDay) return;
    const copied = { ...entry, id: crypto.randomUUID() };
    const targetItems = [...(selected.days[target] ?? []), copied]
      .sort((left, right) => timeToMinutes(left.time) - timeToMinutes(right.time));
    updatePlan({ days: { ...selected.days, [target]: targetItems } });
  };

  const save = async () => {
    const supabase = getSupabaseClient();
    if (!household || !supabase) return;
    setStatus('saving');
    setError(null);

    const cleaned = cloneSchedules(schedules).map((schedule) => ({
      ...schedule,
      days: Object.fromEntries(
        Object.entries(schedule.days).map(([day, items]) => [
          day,
          (items ?? []).slice().sort((left, right) => timeToMinutes(left.time) - timeToMinutes(right.time)),
        ])
      ),
    }));

    try {
      await new SupabaseScheduleRepository(supabase).save(household.id, cleaned);
      setSchedules(cleaned);
      setStatus('saved');
      window.setTimeout(() => setStatus('idle'), 1500);
    } catch (saveError) {
      console.error('Could not save schedules', saveError);
      setError(errorMessage(saveError));
      setStatus('error');
    }
  };

  const createDisabled = status === 'loading' || status === 'error';

  return (
    <div style={{ minHeight: '100vh', background: '#fff9f0', fontFamily: font, color: ink, padding: '32px 20px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18, marginBottom: 28, flexWrap: 'wrap' }}>
          <div>
            <button onClick={() => navigate('/')} style={{ ...button('#fff', ink), border: '2px solid rgba(0,0,0,.08)', marginBottom: 16 }}>← Back</button>
            <div style={{ fontSize: 18, fontWeight: 800, color: blue, textTransform: 'uppercase', letterSpacing: '.12em' }}>Parent settings</div>
            <h1 style={{ margin: '6px 0 0', fontSize: 52, lineHeight: 1.05 }}>Schedules</h1>
            <p style={{ margin: '12px 0 0', color: mute, fontSize: 22, lineHeight: 1.4 }}>Create reusable plans, assign them to children, and choose which one is active.</p>
          </div>
          <button onClick={createPlan} disabled={createDisabled} style={{ ...button(blue), opacity: createDisabled ? 0.55 : 1 }}>+ Create schedule</button>
        </div>

        {childWarning && <div style={{ padding: 18, borderRadius: 18, background: '#fef3c7', color: '#92400e', marginBottom: 18, fontSize: 18 }}>{childWarning}</div>}

        {status === 'loading' ? (
          <div style={{ fontSize: 22 }}>Loading…</div>
        ) : status === 'error' ? (
          <div style={{ padding: 22, borderRadius: 18, background: '#fee2e2', color: '#b91c1c', fontSize: 20 }}>
            <strong>Could not load or save schedules.</strong>
            <div style={{ marginTop: 8, fontSize: 18 }}>{error}</div>
            <button onClick={() => window.location.reload()} style={{ ...button('#fff', '#b91c1c'), marginTop: 16 }}>Try again</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,320px) minmax(0,1fr)', gap: 22 }}>
            <aside style={{ background: '#fff', borderRadius: 26, padding: 18, border: '2px solid rgba(0,0,0,.07)', height: 'fit-content' }}>
              {schedules.length === 0 ? <div style={{ padding: 18, color: mute, fontSize: 20 }}>No schedules yet.</div> : schedules.map((schedule) => (
                <button key={schedule.id} onClick={() => setSelectedId(schedule.id)} style={{ width: '100%', textAlign: 'left', padding: 16, marginBottom: 10, borderRadius: 18, border: schedule.id === selectedId ? `3px solid ${blue}` : '2px solid rgba(0,0,0,.07)', background: schedule.id === selectedId ? '#e0f2fe' : '#fff', fontFamily: font, cursor: 'pointer' }}>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>{schedule.name}</div>
                  <div style={{ fontSize: 17, color: mute, marginTop: 5 }}>{schedule.active ? 'Active' : 'Inactive'} · {schedule.childIds.length === 0 ? 'All children' : `${schedule.childIds.length} assigned`}</div>
                </button>
              ))}
            </aside>

            <main>
              {!selected ? (
                <div style={{ background: '#fff', borderRadius: 26, padding: 36, textAlign: 'center', color: mute, fontSize: 22 }}>Create or select a schedule.</div>
              ) : (
                <div style={{ background: '#fff', borderRadius: 26, padding: 24, border: '2px solid rgba(0,0,0,.07)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
                    <div>
                      <input value={selected.name} onChange={(event) => updatePlan({ name: event.target.value })} style={{ ...input, fontSize: 28, fontWeight: 800 }} />
                      <input value={selected.description ?? ''} onChange={(event) => updatePlan({ description: event.target.value })} placeholder="Description" style={{ ...input, marginTop: 10 }} />
                    </div>
                    <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 800, fontSize: 20 }}>
                      <input type="checkbox" checked={selected.active} onChange={(event) => { const checked = event.target.checked; setSchedules((previous) => previous.map((schedule) => ({ ...schedule, active: schedule.id === selected.id ? checked : checked ? false : schedule.active }))); }} style={{ width: 24, height: 24 }} /> Active
                    </label>
                  </div>

                  <div style={{ marginTop: 22, fontWeight: 800, fontSize: 22 }}>Applies to</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                    {children.map((child) => (
                      <label key={child.id} style={{ padding: '11px 15px', borderRadius: 99, background: selected.childIds.includes(child.id) ? '#e0f2fe' : '#f5ede2', cursor: 'pointer', fontSize: 19, fontWeight: 700 }}>
                        <input type="checkbox" checked={selected.childIds.includes(child.id)} onChange={(event) => updatePlan({ childIds: event.target.checked ? [...selected.childIds, child.id] : selected.childIds.filter((id) => id !== child.id) })} style={{ width: 20, height: 20, marginRight: 7 }} />
                        {child.name}
                      </label>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8, marginTop: 24 }}>
                    {SCHEDULE_DAYS.map((day) => (
                      <button key={day} onClick={() => setSelectedDay(day)} style={{ ...button(day === selectedDay ? blue : '#f0f9ff', day === selectedDay ? '#fff' : '#0369a1'), padding: '13px 4px', fontSize: 17 }}>{day.slice(0, 3)}</button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginTop: 24, flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, fontSize: 34 }}>{selectedDay}</h2>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <select value={copyTarget} onChange={(event) => setCopyTarget(event.target.value as ScheduleDay)} style={{ ...input, width: 'auto', minWidth: 170 }}>
                        {SCHEDULE_DAYS.filter((day) => day !== selectedDay).map((day) => <option key={day} value={day}>Copy to {day}</option>)}
                      </select>
                      <button onClick={copyDay} style={button('#e0f2fe', '#0369a1')}>Copy day</button>
                      <button onClick={addItem} style={button(blue)}>+ Activity</button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
                    {(selected.days[selectedDay] ?? []).map((entry) => {
                      const taskTarget = taskCopyTargets[entry.id] ?? SCHEDULE_DAYS.find((day) => day !== selectedDay) ?? 'Monday';
                      return (
                        <div key={entry.id} style={{ display: 'grid', gridTemplateColumns: '130px 82px 1fr auto', gap: 12, alignItems: 'center', padding: 16, borderRadius: 22, background: '#f8fafc' }}>
                          <input type="time" value={entry.time} onChange={(event) => updateItems((selected.days[selectedDay] ?? []).map((item) => item.id === entry.id ? { ...item, time: event.target.value } : item))} style={input} />
                          <input value={entry.icon} onChange={(event) => updateItems((selected.days[selectedDay] ?? []).map((item) => item.id === entry.id ? { ...item, icon: event.target.value } : item))} style={{ ...input, textAlign: 'center', fontSize: 30, padding: '13px 8px' }} />
                          <div>
                            <input value={entry.title} onChange={(event) => updateItems((selected.days[selectedDay] ?? []).map((item) => item.id === entry.id ? { ...item, title: event.target.value } : item))} style={{ ...input, fontSize: 24, fontWeight: 800 }} />
                            <input value={entry.note ?? ''} onChange={(event) => updateItems((selected.days[selectedDay] ?? []).map((item) => item.id === entry.id ? { ...item, note: event.target.value } : item))} placeholder="Optional note" style={{ ...input, marginTop: 8, fontSize: 18 }} />
                            <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                              <select value={taskTarget} onChange={(event) => setTaskCopyTargets((previous) => ({ ...previous, [entry.id]: event.target.value as ScheduleDay }))} style={{ ...input, width: 'auto', minWidth: 175, padding: '10px 12px', fontSize: 17 }}>
                                {SCHEDULE_DAYS.filter((day) => day !== selectedDay).map((day) => <option key={day} value={day}>Copy task to {day}</option>)}
                              </select>
                              <button onClick={() => copyTask(entry)} style={{ ...button('#e0f2fe', '#0369a1'), padding: '10px 14px', fontSize: 17 }}>Copy task</button>
                            </div>
                          </div>
                          <button aria-label={`Delete ${entry.title}`} onClick={() => updateItems((selected.days[selectedDay] ?? []).filter((item) => item.id !== entry.id))} style={button('#fee2e2', '#b91c1c')}>×</button>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14, marginTop: 24 }}>
                    <span style={{ fontSize: 18, color: status === 'saved' ? '#15803d' : mute }}>{status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved to cloud' : ''}</span>
                    <button onClick={() => void save()} style={button(blue)}>Save schedules</button>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
