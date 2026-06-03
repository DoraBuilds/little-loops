import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3, Settings, Sparkles, Sun, MoonStar, PartyPopper, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { Child, HomeScene, RoutineType } from '@/lib/types';
import { ChildProfileAvatar } from './ChildProfileAvatar';
import { HomeSceneBackdrop } from './HomeSceneBackdrop';

type CloudSyncStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ChildSelectorProps {
  children: Child[];
  globalTheme: 'morning' | 'evening' | 'free';
  homeScene: HomeScene;
  dueRoutineByChild: Record<string, RoutineType | null>;
  cloudSyncStatus?: CloudSyncStatus;
  onSelectChild: (id: string) => void;
  onOpenSettings: () => void;
}

export const ChildSelector = ({
  children,
  globalTheme,
  homeScene,
  cloudSyncStatus,
  dueRoutineByChild,
  onSelectChild,
  onOpenSettings,
}: ChildSelectorProps) => {
  const holdTimerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const [isHoldingParentGate, setIsHoldingParentGate] = useState(false);
  const [parentGateProgress, setParentGateProgress] = useState(0);

  const clearParentGateTimers = () => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const startParentGateHold = () => {
    clearParentGateTimers();
    setIsHoldingParentGate(true);
    setParentGateProgress(0);

    const start = performance.now();
    progressTimerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - start;
      setParentGateProgress(Math.min(100, (elapsed / 1200) * 100));
    }, 16);

    holdTimerRef.current = window.setTimeout(() => {
      clearParentGateTimers();
      setIsHoldingParentGate(false);
      setParentGateProgress(100);
      onOpenSettings();
      window.setTimeout(() => setParentGateProgress(0), 150);
    }, 1200);
  };

  const cancelParentGateHold = () => {
    clearParentGateTimers();
    setIsHoldingParentGate(false);
    setParentGateProgress(0);
  };

  useEffect(() => () => clearParentGateTimers(), []);

  const title =
    globalTheme === 'morning'
      ? 'Morning routine time'
      : globalTheme === 'evening'
        ? 'Evening routine time'
        : 'Little Loops';
  const subtitle =
    globalTheme === 'morning'
      ? 'The sun is up and morning routines are ready.'
      : globalTheme === 'evening'
        ? 'The stars are out and bedtime routines are ready.'
        : 'Who is ready to shine today?';
  const dueChildren = children.filter((child) => dueRoutineByChild[child.id]);
  const dueLabel =
    globalTheme === 'morning'
      ? 'Morning jobs are ready now'
      : globalTheme === 'evening'
        ? 'Evening jobs are ready now'
        : 'No routine is due right now';
  const helperText =
    globalTheme === 'free'
      ? 'Choose a child to play, explore, or check in later.'
      : dueChildren.length === 1
        ? `${dueChildren[0].name} has a routine ready to start.`
        : `${dueChildren.length} children have a routine ready right now.`;

  return (
    <div className="relative isolate mx-auto min-h-svh max-w-5xl px-4 py-8 sm:px-5 md:px-6 md:py-14">
      <HomeSceneBackdrop scene={homeScene} theme={globalTheme} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_40%)]" />

      <header className="relative z-10 mb-10 md:mb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-4xl font-bold text-primary sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.24em] ${
            globalTheme === 'morning'
              ? 'bg-white/85 text-primary'
              : globalTheme === 'evening'
                ? 'bg-slate-950/45 text-yellow-100'
                : 'bg-white/80 text-foreground'
          }`}
        >
          {globalTheme === 'morning' ? (
            <Sun size={16} />
          ) : globalTheme === 'evening' ? (
            <MoonStar size={16} />
          ) : (
            <PartyPopper size={16} />
          )}
          {dueLabel}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="mt-3 text-sm md:text-base font-medium text-muted-foreground max-w-2xl mx-auto"
        >
          {helperText}
        </motion.p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className={`relative z-10 mb-6 rounded-[30px] border px-5 py-4 md:px-6 ${
          globalTheme === 'free'
            ? 'border-white/70 bg-card/78 backdrop-blur-md'
            : globalTheme === 'morning'
              ? 'border-white/75 bg-white/75 backdrop-blur-md'
              : 'border-white/10 bg-slate-950/35 text-white backdrop-blur-md'
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                globalTheme === 'morning'
                  ? 'bg-primary/12 text-primary'
                  : globalTheme === 'evening'
                    ? 'bg-white/10 text-yellow-100'
                    : 'bg-primary/10 text-primary'
              }`}
            >
              {globalTheme === 'free' ? <Sparkles size={22} /> : <Clock3 size={22} />}
            </div>
            <div>
              <p className={`text-lg font-bold ${globalTheme === 'evening' ? 'text-white' : 'text-foreground'}`}>
                {globalTheme === 'free'
                  ? 'Free-time screen'
                  : 'Choose the child whose routine should start'}
              </p>
              <p className={`mt-1 text-sm ${globalTheme === 'evening' ? 'text-slate-200/85' : 'text-muted-foreground'}`}>
                {globalTheme === 'free'
                  ? 'Nothing is due right now, so this is a calm home screen.'
                  : 'Children with something due now are highlighted below.'}
              </p>
            </div>
          </div>
          {globalTheme !== 'free' && dueChildren.length > 0 && (
            <div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.24em] ${
              globalTheme === 'evening'
                ? 'bg-white/10 text-yellow-100'
                : 'bg-primary/10 text-primary'
            }`}>
              {dueChildren.length === 1 ? '1 child ready' : `${dueChildren.length} children ready`}
            </div>
          )}
        </div>
      </motion.section>

      <div className="relative z-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {children.map((child, i) => {
          const dueRoutine = dueRoutineByChild[child.id];
          const isDueNow = Boolean(dueRoutine);

          return (
            <motion.button
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectChild(child.id)}
              aria-label={`Select ${child.name}`}
              className={`group relative overflow-hidden rounded-[32px] border p-5 md:rounded-[36px] md:p-6 shadow-card backdrop-blur-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isDueNow
                  ? globalTheme === 'evening'
                    ? 'border-yellow-100/60 bg-slate-950/45 ring-2 ring-yellow-100/35'
                    : 'border-primary/40 bg-card/90 ring-2 ring-primary/25'
                  : 'border-white/70 bg-card/82'
              }`}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),transparent_55%)]" />
              <div className="relative flex flex-col items-center text-center">
                {isDueNow && (
                  <div className={`absolute right-0 top-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${
                    globalTheme === 'evening'
                      ? 'bg-yellow-100 text-slate-900'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    Due now
                  </div>
                )}
                <ChildProfileAvatar
                  name={child.name}
                  seed={child.avatarSeed ?? child.id}
                  animalKey={child.avatarAnimal}
                  size="lg"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="mt-8">
                  <span className={`block text-2xl md:text-[1.75rem] font-black tracking-[0.18em] ${
                    globalTheme === 'evening' && isDueNow ? 'text-white' : 'text-foreground'
                  }`}>
                    {child.name.toUpperCase()}
                  </span>
                  {isDueNow ? (
                    <>
                      <span className={`mt-2 block text-sm font-black uppercase tracking-[0.24em] ${
                        globalTheme === 'evening' ? 'text-yellow-100' : 'text-primary'
                      }`}>
                        {dueRoutine === 'morning' ? 'Morning routine ready' : 'Evening routine ready'}
                      </span>
                      <span className={`mt-1 block text-xs font-medium ${
                        globalTheme === 'evening' ? 'text-slate-200/85' : 'text-muted-foreground'
                      }`}>
                        Tap to start now
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                        {globalTheme === 'free' ? 'Free time right now' : 'No routine due'}
                      </span>
                      <span className="mt-1 block text-xs font-medium text-muted-foreground">
                        Tap to check in anyway
                      </span>
                    </>
                  )}
                </div>
                <div className={`mt-6 flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                  isDueNow
                    ? globalTheme === 'evening'
                      ? 'bg-yellow-100 text-slate-900 group-hover:bg-white'
                      : 'bg-primary text-primary-foreground group-hover:bg-primary/90'
                    : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                }`}>
                  <ArrowRight size={20} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="relative z-10 mt-10 md:mt-12 flex flex-col items-center gap-4">
        {cloudSyncStatus && cloudSyncStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
              cloudSyncStatus === 'error'
                ? globalTheme === 'evening'
                  ? 'bg-red-900/50 text-red-200'
                  : 'bg-destructive/10 text-destructive'
                : cloudSyncStatus === 'saving'
                  ? globalTheme === 'evening'
                    ? 'bg-slate-800/60 text-slate-300'
                    : 'bg-primary/10 text-primary'
                  : globalTheme === 'evening'
                    ? 'bg-slate-800/60 text-emerald-300'
                    : 'bg-success/10 text-success'
            }`}
          >
            {cloudSyncStatus === 'error' ? (
              <AlertCircle size={13} />
            ) : cloudSyncStatus === 'saving' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <CheckCircle2 size={13} />
            )}
            {cloudSyncStatus === 'error'
              ? 'Sync error — open Parent Settings'
              : cloudSyncStatus === 'saving'
                ? 'Saving…'
                : 'Synced'}
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center mx-auto text-muted-foreground hover:text-foreground transition-colors gap-3 text-lg"
          type="button"
          onPointerDown={startParentGateHold}
          onPointerUp={cancelParentGateHold}
          onPointerLeave={cancelParentGateHold}
          onPointerCancel={cancelParentGateHold}
          onKeyDown={(event) => {
            if ((event.key === 'Enter' || event.key === ' ') && !isHoldingParentGate) {
              event.preventDefault();
              startParentGateHold();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              cancelParentGateHold();
            }
          }}
          aria-label="Press and hold to open Parent Settings"
        >
          <div className="flex items-center gap-2">
            <Settings size={20} />
            Parent Settings
          </div>
          <div className="w-56 max-w-full">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-75"
                style={{ width: `${parentGateProgress}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
              {isHoldingParentGate ? 'Keep holding...' : 'Press and hold to open'}
            </p>
          </div>
        </motion.button>
      </div>
    </div>
  );
};
