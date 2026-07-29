import { useEffect, useMemo, useState } from 'react';
import type { Child, RoutineType, Task } from '@/lib/types';
import { AGE_BUCKETS, groupTasksByAge, TASK_CATALOG } from '@/lib/types';
import { MASCOTS, getMascot, DEFAULT_BADGES, DEFAULT_MOODS } from '@/lib/mascots';
import { TaskIcon } from './TaskIcon';

// ── Design tokens ──────────────────────────────────────────────────────────
const T = {
  fonts: `'Fredoka', system-ui, sans-serif`,
  ink: '#3d2c1f',
  inkMute: '#8a7866',
  cream: '#fff9f0',
  peach: '#ffe8d6',
  white: '#ffffff',
  border: 'rgba(180,120,80,0.10)',
  borderStrong: 'rgba(180,120,80,0.18)',
  orange: '#f97316',
  orangeLight: '#fff1e8',
  purple: '#7c3aed',
  purpleLight: '#ede9fe',
  shadow: '0 4px 14px rgba(180,120,80,0.08)',
  shadowMd: '0 6px 20px rgba(180,120,80,0.12)',
};

// ── Types ──────────────────────────────────────────────────────────────────
interface InitialSetupProps {
  children: Child[];
  signedInEmail?: string | null;
  onSignOut?: () => void;
  cloudSyncStatus?: 'idle' | 'saving' | 'saved' | 'error';
  cloudSyncError?: string | null;
  onRetryCloudSync?: () => void;
  onChange?: (children: Child[]) => void;
  onComplete: (children: Child[]) => void;
}

type SelectionState = Record<string, Record<RoutineType, string[]>>;
type SetupTab = 'profile' | 'routines';

// ── Constants ──────────────────────────────────────────────────────────────
const STARTER_TASKS: Record<RoutineType, string[]> = {
  morning: ['Use the toilet', 'Eat breakfast', 'Brush teeth'],
  evening: ['Use the toilet', 'Put on pajamas', 'Brush teeth'],
};

const DEFAULT_SCHEDULE = {
  morning: { start: '07:00', end: '09:00' },
  evening: { start: '17:00', end: '20:00' },
} as const;

// ── Child factory (includes all new fields) ────────────────────────────────
const createChildDraft = (count: number): Child => {
  const mascot = MASCOTS[(count - 1) % MASCOTS.length];
  return {
    id: crypto.randomUUID(),
    name: `Child ${count}`,
    age: 5,
    ageBucket: '4-6',
    avatarSeed: crypto.randomUUID(),
    avatarAnimal: mascot.id,
    mascotId: mascot.id,
    streak: 0,
    affirmations: [],
    badges: { ...DEFAULT_BADGES },
    moods: DEFAULT_MOODS.map((m) => ({ ...m })),
    schedule: {
      morning: { ...DEFAULT_SCHEDULE.morning },
      evening: { ...DEFAULT_SCHEDULE.evening },
    },
    morning: [],
    evening: [],
  };
};

// ── Selection state helpers ────────────────────────────────────────────────
const buildSelectionState = (children: Child[]): SelectionState =>
  Object.fromEntries(
    children.map((child) => [
      child.id,
      {
        morning:
          child.morning.length > 0
            ? child.morning.map((task) => task.title)
            : [...STARTER_TASKS.morning],
        evening:
          child.evening.length > 0
            ? child.evening.map((task) => task.title)
            : [...STARTER_TASKS.evening],
      },
    ])
  );

const ensureChildSelection = (state: SelectionState, childId: string): SelectionState => {
  if (state[childId]) return state;
  return {
    ...state,
    [childId]: {
      morning: [...STARTER_TASKS.morning],
      evening: [...STARTER_TASKS.evening],
    },
  };
};

const buildRoutineTasks = (
  childId: string,
  routine: RoutineType,
  selectedTitles: string[]
): Task[] =>
  TASK_CATALOG[routine]
    .filter((task) => selectedTitles.includes(task.title))
    .map((task, index) => ({
      id: `${childId}-${routine}-${task.id}-${index}`,
      title: task.title,
      icon: task.icon,
      completed: false,
    }));

const buildConfiguredChildren = (
  draftChildren: Child[],
  selectionState: SelectionState
): Child[] =>
  draftChildren.map((child) => ({
    ...child,
    name: child.name.trim() || 'Child',
    morning: buildRoutineTasks(
      child.id,
      'morning',
      selectionState[child.id]?.morning ?? []
    ),
    evening: buildRoutineTasks(
      child.id,
      'evening',
      selectionState[child.id]?.evening ?? []
    ),
  }));

// ── Tiny shared UI helpers ─────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: T.inkMute,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: T.white,
        borderRadius: 22,
        padding: '16px',
        border: `1.5px solid ${T.border}`,
        boxShadow: T.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export const InitialSetup = ({
  children,
  signedInEmail,
  onSignOut,
  cloudSyncStatus = 'idle',
  cloudSyncError,
  onRetryCloudSync,
  onChange,
  onComplete,
}: InitialSetupProps) => {
  const [draftChildren, setDraftChildren] = useState(children);
  const [selectionState, setSelectionState] = useState<SelectionState>(() =>
    buildSelectionState(children)
  );
  const [activeChildId, setActiveChildId] = useState<string | null>(
    children[0]?.id ?? null
  );
  const [activeTab, setActiveTab] = useState<SetupTab>('profile');
  const [activeRoutine, setActiveRoutine] = useState<RoutineType>('morning');

  useEffect(() => {
    setDraftChildren(children);
    setSelectionState(buildSelectionState(children));
  }, [children]);

  useEffect(() => {
    if (draftChildren.length === 0) {
      setActiveChildId(null);
      return;
    }
    setActiveChildId((current) =>
      current && draftChildren.some((c) => c.id === current)
        ? current
        : draftChildren[0].id
    );
  }, [draftChildren]);

  const activeChild = draftChildren.find((c) => c.id === activeChildId) ?? null;
  const selectedTitles = activeChild
    ? (selectionState[activeChild.id]?.[activeRoutine] ?? [])
    : [];

  const readyChildren = useMemo(
    () =>
      draftChildren.filter((child) => {
        const hasProfile = child.name.trim().length > 0;
        const morningCount = selectionState[child.id]?.morning.length ?? 0;
        const eveningCount = selectionState[child.id]?.evening.length ?? 0;
        return hasProfile && morningCount > 0 && eveningCount > 0;
      }).length,
    [draftChildren, selectionState]
  );

  const emitConfiguredChildren = (
    nextDraft: Child[],
    nextSelection: SelectionState
  ) => {
    onChange?.(buildConfiguredChildren(nextDraft, nextSelection));
  };

  const updateChild = (id: string, updater: (c: Child) => Child) => {
    setDraftChildren((current) => {
      const next = current.map((c) => (c.id === id ? updater(c) : c));
      emitConfiguredChildren(next, selectionState);
      return next;
    });
  };

  const addChild = () => {
    const next = createChildDraft(draftChildren.length + 1);
    const nextDraft = [...draftChildren, next];
    const nextSel = ensureChildSelection(selectionState, next.id);
    setDraftChildren(nextDraft);
    setSelectionState(nextSel);
    emitConfiguredChildren(nextDraft, nextSel);
    setActiveChildId(next.id);
    setActiveTab('profile');
  };

  const removeChild = (childId: string) => {
    const nextDraft = draftChildren.filter((c) => c.id !== childId);
    const nextSel = { ...selectionState };
    delete nextSel[childId];
    setDraftChildren(nextDraft);
    setSelectionState(nextSel);
    emitConfiguredChildren(nextDraft, nextSel);
  };

  const toggleTask = (childId: string, routine: RoutineType, title: string) => {
    const resolved = ensureChildSelection(selectionState, childId);
    const selected = resolved[childId][routine];
    const nextSelected = selected.includes(title)
      ? selected.filter((item) => item !== title)
      : [...selected, title];
    const nextSel = {
      ...resolved,
      [childId]: { ...resolved[childId], [routine]: nextSelected },
    };
    setSelectionState(nextSel);
    emitConfiguredChildren(draftChildren, nextSel);
  };

  const applyCommonTasks = (childId: string, routine: RoutineType) => {
    const resolved = ensureChildSelection(selectionState, childId);
    const nextSel = {
      ...resolved,
      [childId]: {
        ...resolved[childId],
        [routine]: TASK_CATALOG[routine]
          .filter((t) => t.featured)
          .map((t) => t.title),
      },
    };
    setSelectionState(nextSel);
    emitConfiguredChildren(draftChildren, nextSel);
  };

  const configuredChildren = useMemo(
    () => buildConfiguredChildren(draftChildren, selectionState),
    [draftChildren, selectionState]
  );

  const handleComplete = () => onComplete(configuredChildren);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100svh',
        background: T.cream,
        fontFamily: T.fonts,
        color: T.ink,
        overflowY: 'auto',
      }}
    >
      {/* Soft decorative blobs */}
      <div
        style={{
          position: 'fixed',
          top: -80,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(251,191,36,0.12)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: -60,
          right: -40,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'rgba(167,139,250,0.1)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '24px 16px 40px' }}>

        {/* ── Top bar: signed-in pill + cloud sync ── */}
        {(signedInEmail || cloudSyncStatus !== 'idle' || cloudSyncError) && (
          <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
            {signedInEmail && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.white, borderRadius: 99, padding: '6px 14px 6px 10px', border: `1.5px solid ${T.border}`, boxShadow: T.shadow }}>
                <div style={{ fontSize: 18 }}>☁️</div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T.inkMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Signed in</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>{signedInEmail}</div>
                </div>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    style={{ marginLeft: 6, background: 'none', border: `1.5px solid ${T.border}`, borderRadius: 10, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: T.inkMute, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Sign out
                  </button>
                )}
              </div>
            )}

            {cloudSyncError ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff5f5', borderRadius: 14, padding: '8px 12px', border: '1.5px solid rgba(220,38,38,0.15)', flex: 1 }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <div style={{ flex: 1, fontSize: 12, color: '#dc2626', fontWeight: 500 }}>{cloudSyncError}</div>
                {onRetryCloudSync && (
                  <button onClick={onRetryCloudSync} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 10, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Retry
                  </button>
                )}
              </div>
            ) : cloudSyncStatus !== 'idle' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.white, borderRadius: 12, padding: '6px 12px', border: `1.5px solid ${T.border}` }}>
                <span style={{ fontSize: 14 }}>
                  {cloudSyncStatus === 'saved' ? '✅' : cloudSyncStatus === 'saving' ? '🔄' : '⚠️'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: cloudSyncStatus === 'saved' ? '#16a34a' : cloudSyncStatus === 'error' ? '#dc2626' : '#2563eb' }}>
                  {cloudSyncStatus === 'saved' ? 'Saved to cloud' : cloudSyncStatus === 'saving' ? 'Saving…' : 'Sync error'}
                </span>
              </div>
            ) : null}
          </div>
        )}

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.orange, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
            ☀️ Parent Setup
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: T.ink, lineHeight: 1.2, margin: 0 }}>
            Set up your children first
          </h1>
          <p style={{ fontSize: 14, color: T.inkMute, marginTop: 8 }}>
            Start with each child's profile, then switch to routines when you're ready to choose tasks.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: draftChildren.length > 0 ? 'minmax(0,280px) minmax(0,1fr)' : '1fr' }}>

          {/* ── LEFT: Child list ── */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <SectionLabel>Profiles</SectionLabel>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.ink }}>
                  {readyChildren}/{draftChildren.length} ready
                </div>
              </div>
              <button
                onClick={addChild}
                style={{
                  background: T.orange,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '7px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 3px 0 rgba(194,65,12,0.35)',
                }}
              >
                + Add child
              </button>
            </div>

            {draftChildren.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '28px 12px',
                  border: `2px dashed rgba(249,115,22,0.3)`,
                  borderRadius: 18,
                  background: T.orangeLight,
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>🐣</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 6 }}>Create your first child profile</div>
                <div style={{ fontSize: 12, color: T.inkMute, marginBottom: 16 }}>
                  Add a child first, then you can customise their name, age, avatar, and routines.
                </div>
                <button
                  onClick={addChild}
                  style={{
                    background: T.orange,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    padding: '10px 20px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 3px 0 rgba(194,65,12,0.35)',
                  }}
                >
                  + Create first profile
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {draftChildren.map((child) => {
                  const m = getMascot(child.mascotId ?? child.avatarAnimal);
                  const isActive = child.id === activeChildId;
                  const isReady =
                    child.name.trim().length > 0 &&
                    (selectionState[child.id]?.morning.length ?? 0) > 0 &&
                    (selectionState[child.id]?.evening.length ?? 0) > 0;

                  return (
                    <button
                      key={child.id}
                      onClick={() => setActiveChildId(child.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        borderRadius: 16,
                        border: isActive
                          ? `2px solid ${T.orange}`
                          : `1.5px solid ${T.border}`,
                        background: isActive ? T.orangeLight : T.cream,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        color: T.ink,
                        width: '100%',
                        transition: 'all 0.15s',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background: `linear-gradient(135deg, ${m.light}, ${m.color}33)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 22,
                          flexShrink: 0,
                          border: `1.5px solid ${m.color}44`,
                        }}
                      >
                        {m.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          {child.name || 'New child'}
                        </div>
                        <div style={{ fontSize: 10, color: T.inkMute }}>
                          with {m.name} · age {child.age ?? 5}
                        </div>
                      </div>
                      {isReady && (
                        <span style={{ fontSize: 16 }}>✅</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* ── RIGHT: Editing panel ── */}
          {draftChildren.length > 0 && (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              {!activeChild ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', padding: '32px 20px' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
                  <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Start by creating a child profile</div>
                  <div style={{ fontSize: 13, color: T.inkMute, maxWidth: 320, marginBottom: 20 }}>
                    Once you add a child, you'll be able to edit their profile and choose their morning and evening routines.
                  </div>
                  <button
                    onClick={addChild}
                    style={{
                      background: T.orange,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 14,
                      padding: '12px 24px',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      boxShadow: '0 3px 0 rgba(194,65,12,0.35)',
                    }}
                  >
                    + Create first profile
                  </button>
                </div>
              ) : (
                <>
                  {/* Panel header */}
                  <div style={{ padding: '16px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <SectionLabel>Editing</SectionLabel>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>
                        {activeChild.name || 'New child'}
                      </div>
                    </div>

                    {/* Profile / Routines tabs */}
                    <div style={{ display: 'flex', gap: 4, background: T.cream, borderRadius: 14, padding: 4, border: `1.5px solid ${T.border}` }}>
                      {(['profile', 'routines'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          style={{
                            padding: '7px 16px',
                            borderRadius: 10,
                            border: 'none',
                            background: activeTab === tab ? T.white : 'transparent',
                            color: activeTab === tab ? T.ink : T.inkMute,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            boxShadow: activeTab === tab ? T.shadow : 'none',
                            transition: 'all 0.15s',
                          }}
                        >
                          {tab === 'profile' ? '👤 Profile' : '📋 Routines'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '14px 18px 20px' }}>

                    {/* ── PROFILE TAB ─────────────────── */}
                    {activeTab === 'profile' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                        {/* Mascot picker */}
                        <div>
                          <SectionLabel>Pick a mascot</SectionLabel>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
                            {MASCOTS.map((opt) => {
                              const selected =
                                opt.id === (activeChild.mascotId ?? activeChild.avatarAnimal);
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() =>
                                    updateChild(activeChild.id, (c) => ({
                                      ...c,
                                      mascotId: opt.id,
                                      avatarAnimal: opt.id,
                                    }))
                                  }
                                  style={{
                                    background: selected ? opt.light : T.cream,
                                    borderRadius: 14,
                                    padding: '10px 4px 8px',
                                    border: selected
                                      ? `2.5px solid ${opt.color}`
                                      : `1.5px solid ${T.border}`,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.15s',
                                    WebkitTapHighlightColor: 'transparent',
                                  }}
                                >
                                  <div style={{ fontSize: 24 }}>{opt.emoji}</div>
                                  <div style={{ fontSize: 9, fontWeight: 700, color: T.ink, marginTop: 3 }}>
                                    {opt.name}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Name input */}
                        <div>
                          <SectionLabel>Child's name</SectionLabel>
                          <input
                            value={activeChild.name}
                            onChange={(e) =>
                              updateChild(activeChild.id, (c) => ({
                                ...c,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Enter name"
                            style={{
                              width: '100%',
                              padding: '12px 14px',
                              borderRadius: 14,
                              border: `1.5px solid ${T.borderStrong}`,
                              background: T.cream,
                              fontFamily: 'inherit',
                              fontSize: 16,
                              fontWeight: 600,
                              color: T.ink,
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        {/* Age + bucket */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <div>
                            <SectionLabel>Age</SectionLabel>
                            <input
                              type="number"
                              min={2}
                              max={12}
                              value={activeChild.age ?? 5}
                              onChange={(e) =>
                                updateChild(activeChild.id, (c) => ({
                                  ...c,
                                  age: Number(e.target.value),
                                }))
                              }
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: 14,
                                border: `1.5px solid ${T.border}`,
                                background: T.cream,
                                fontFamily: 'inherit',
                                fontSize: 15,
                                fontWeight: 600,
                                color: T.ink,
                                outline: 'none',
                                boxSizing: 'border-box',
                              }}
                            />
                          </div>
                          <div>
                            <SectionLabel>Age group</SectionLabel>
                            <select
                              value={activeChild.ageBucket ?? '4-6'}
                              onChange={(e) =>
                                updateChild(activeChild.id, (c) => ({
                                  ...c,
                                  ageBucket: e.target.value as Child['ageBucket'],
                                }))
                              }
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: 14,
                                border: `1.5px solid ${T.border}`,
                                background: T.cream,
                                fontFamily: 'inherit',
                                fontSize: 14,
                                fontWeight: 600,
                                color: T.ink,
                                outline: 'none',
                                cursor: 'pointer',
                                boxSizing: 'border-box',
                              }}
                            >
                              {AGE_BUCKETS.map((b) => (
                                <option key={b.key} value={b.key}>
                                  {b.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Actions */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 10,
                            background: T.cream,
                            borderRadius: 16,
                            padding: '12px 14px',
                            border: `1.5px solid ${T.border}`,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>Ready to pick routines?</div>
                            <div style={{ fontSize: 11, color: T.inkMute, marginTop: 2 }}>
                              Switch to routines when the profile looks right.
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {draftChildren.length > 1 && (
                              <button
                                onClick={() => removeChild(activeChild.id)}
                                style={{
                                  background: 'none',
                                  border: `1.5px solid rgba(220,38,38,0.25)`,
                                  borderRadius: 12,
                                  padding: '7px 12px',
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  fontFamily: 'inherit',
                                }}
                              >
                                Delete
                              </button>
                            )}
                            <button
                              onClick={() => setActiveTab('routines')}
                              style={{
                                background: T.orange,
                                color: '#fff',
                                border: 'none',
                                borderRadius: 12,
                                padding: '8px 14px',
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                boxShadow: '0 3px 0 rgba(194,65,12,0.3)',
                              }}
                            >
                              Go to routines →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── ROUTINES TAB ─────────────────── */}
                    {activeTab === 'routines' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                        {/* Morning / Evening toggle */}
                        <div style={{ display: 'flex', gap: 6 }}>
                          {(['morning', 'evening'] as const).map((routine) => (
                            <button
                              key={routine}
                              onClick={() => setActiveRoutine(routine)}
                              style={{
                                flex: 1,
                                padding: '10px 0',
                                borderRadius: 14,
                                background:
                                  activeRoutine === routine
                                    ? routine === 'morning'
                                      ? 'linear-gradient(135deg,#fed7aa,#fdba74)'
                                      : 'linear-gradient(135deg,#a78bfa,#7c3aed)'
                                    : T.cream,
                                color:
                                  activeRoutine === routine
                                    ? routine === 'morning'
                                      ? '#7c2d12'
                                      : '#fff'
                                    : T.inkMute,
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                border: `1.5px solid ${T.border}`,
                                transition: 'all 0.15s',
                                WebkitTapHighlightColor: 'transparent',
                              }}
                            >
                              {routine === 'morning' ? '☀️ Morning' : '🌙 Evening'}
                            </button>
                          ))}
                        </div>

                        {/* Section heading */}
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>
                            Choose active routine tasks
                          </div>
                          <div style={{ fontSize: 12, color: T.inkMute, marginTop: 2 }}>
                            Start from a few basics, then add more if this child is ready.
                          </div>
                        </div>

                        {/* Task count hint */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: T.inkMute }}>
                            {selectedTitles.length} tasks selected
                          </div>
                          <button
                            onClick={() => applyCommonTasks(activeChild.id, activeRoutine)}
                            style={{
                              background: 'none',
                              border: `1.5px solid ${T.border}`,
                              borderRadius: 10,
                              padding: '4px 10px',
                              fontSize: 10,
                              fontWeight: 700,
                              color: T.orange,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                            }}
                          >
                            Use common tasks
                          </button>
                        </div>

                        {selectedTitles.length <= 3 && (
                          <div
                            style={{
                              background: T.orangeLight,
                              borderRadius: 12,
                              padding: '10px 14px',
                              fontSize: 12,
                              color: '#9a3412',
                              fontWeight: 500,
                              border: `1px solid rgba(249,115,22,0.2)`,
                            }}
                          >
                            ✨ We started with a few basics. Add more if this child is ready!
                          </div>
                        )}

                        {/* Task groups */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {groupTasksByAge(TASK_CATALOG[activeRoutine]).map((group) => (
                            <div key={`${activeChild.id}-${activeRoutine}-${group.key}`}>
                              <div style={{ marginBottom: 8 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                  {group.label}
                                </div>
                                <div style={{ fontSize: 10, color: T.inkMute, marginTop: 2 }}>
                                  {group.description}
                                </div>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 8 }}>
                                {group.tasks.map((task) => {
                                  const isSelected = selectedTitles.includes(task.title);
                                  return (
                                    <button
                                      key={`${activeChild.id}-${activeRoutine}-${task.id}`}
                                      onClick={() =>
                                        toggleTask(activeChild.id, activeRoutine, task.title)
                                      }
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '10px 12px',
                                        borderRadius: 16,
                                        border: isSelected
                                          ? `2px solid ${T.orange}`
                                          : `1.5px solid ${T.border}`,
                                        background: isSelected ? T.orangeLight : T.white,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontFamily: 'inherit',
                                        color: T.ink,
                                        transition: 'all 0.15s',
                                        WebkitTapHighlightColor: 'transparent',
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: 36,
                                          height: 36,
                                          borderRadius: 10,
                                          background: isSelected ? T.orange : T.cream,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          flexShrink: 0,
                                          color: isSelected ? '#fff' : T.ink,
                                        }}
                                      >
                                        <TaskIcon iconKey={task.icon} size={18} strokeWidth={2.5} />
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>
                                          {task.title}
                                        </div>
                                        {isSelected && (
                                          <div style={{ fontSize: 10, color: T.orange, marginTop: 1 }}>
                                            ✓ Added
                                          </div>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Schedule */}
                        <div style={{ background: T.cream, borderRadius: 16, padding: '14px', border: `1.5px solid ${T.border}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                            <span style={{ fontSize: 16 }}>⏰</span>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>When should it show?</div>
                          </div>
                          <p style={{ fontSize: 11, color: T.inkMute, marginBottom: 12 }}>
                            Controls whether morning or evening routine appears as due on the home screen.
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {(['morning', 'evening'] as const).map((routine) => (
                              <div
                                key={`${activeChild.id}-${routine}`}
                                style={{
                                  background: T.white,
                                  borderRadius: 14,
                                  padding: '10px 12px',
                                  border: `1.5px solid ${T.border}`,
                                }}
                              >
                                <div style={{ fontSize: 10, fontWeight: 700, color: T.inkMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                                  {routine === 'morning' ? '☀️ Morning' : '🌙 Evening'}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                  {(['start', 'end'] as const).map((bound) => (
                                    <div key={bound}>
                                      <div style={{ fontSize: 9, color: T.inkMute, marginBottom: 3 }}>
                                        {bound === 'start' ? 'Start' : 'End'}
                                      </div>
                                      <input
                                        type="time"
                                        value={
                                          activeChild.schedule?.[routine]?.[bound] ??
                                          DEFAULT_SCHEDULE[routine][bound]
                                        }
                                        onChange={(e) =>
                                          updateChild(activeChild.id, (c) => ({
                                            ...c,
                                            schedule: {
                                              morning:
                                                c.schedule?.morning ?? {
                                                  ...DEFAULT_SCHEDULE.morning,
                                                },
                                              evening:
                                                c.schedule?.evening ?? {
                                                  ...DEFAULT_SCHEDULE.evening,
                                                },
                                              [routine]: {
                                                start:
                                                  c.schedule?.[routine].start ??
                                                  DEFAULT_SCHEDULE[routine].start,
                                                end:
                                                  c.schedule?.[routine].end ??
                                                  DEFAULT_SCHEDULE[routine].end,
                                                [bound]: e.target.value,
                                              },
                                            },
                                          }))
                                        }
                                        style={{
                                          width: '100%',
                                          padding: '5px 6px',
                                          borderRadius: 8,
                                          border: `1.5px solid ${T.border}`,
                                          background: T.cream,
                                          fontFamily: 'inherit',
                                          fontSize: 12,
                                          color: T.ink,
                                          outline: 'none',
                                          boxSizing: 'border-box',
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Card>
          )}
        </div>

        {/* ── Finish bar ── */}
        {draftChildren.length > 0 && (
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              background: T.white,
              borderRadius: 22,
              padding: '16px 20px',
              border: `1.5px solid ${T.border}`,
              boxShadow: T.shadowMd,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Finish setup</div>
              <div style={{ fontSize: 11, color: T.inkMute, marginTop: 2 }}>
                You can always edit profiles and routines later in Parent Settings.
              </div>
            </div>
            <button
              onClick={handleComplete}
              style={{
                background: 'linear-gradient(135deg,#f97316,#ea580c)',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                padding: '12px 28px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 0 rgba(194,65,12,0.4)',
                transition: 'transform 0.1s',
              }}
            >
              Save and open the app ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
