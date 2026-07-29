import { motion } from 'framer-motion';
import type { HomeScene } from '@/lib/types';

type HomeBackdropTheme = 'morning' | 'evening' | 'free';

interface HomeSceneBackdropProps {
  scene: HomeScene;
  theme: HomeBackdropTheme;
}

const sceneStyles: Record<
  HomeScene,
  { sky: string; horizon: string; ground: string; glow: string }
> = {
  bike: {
    sky: 'from-sky-300 via-cyan-200 to-lime-100',
    horizon: 'from-emerald-200/70 via-lime-200/55 to-transparent',
    ground: 'from-lime-300/90 via-emerald-300/70 to-emerald-500/65',
    glow: 'bg-yellow-200/45',
  },
  school: {
    sky: 'from-sky-300 via-blue-200 to-cyan-100',
    horizon: 'from-emerald-100/70 via-yellow-100/45 to-transparent',
    ground: 'from-emerald-200/90 via-green-300/70 to-emerald-500/65',
    glow: 'bg-yellow-100/40',
  },
  kite: {
    sky: 'from-sky-300 via-cyan-200 to-blue-100',
    horizon: 'from-green-100/70 via-lime-100/45 to-transparent',
    ground: 'from-lime-200/90 via-green-300/70 to-emerald-500/65',
    glow: 'bg-white/35',
  },
  sandcastle: {
    sky: 'from-sky-300 via-cyan-200 to-blue-100',
    horizon: 'from-cyan-100/55 via-white/30 to-transparent',
    ground: 'from-amber-100/90 via-yellow-100/70 to-orange-200/75',
    glow: 'bg-yellow-100/45',
  },
};

const themeOverlay: Record<HomeBackdropTheme, string> = {
  morning: 'from-yellow-200/30 via-transparent to-white/10',
  evening: 'from-slate-950/28 via-indigo-950/20 to-slate-950/36',
  free: 'from-white/12 via-transparent to-white/8',
};

const SkyGlow = ({ scene }: { scene: HomeScene }) => (
  <>
    <div className={`absolute left-[-6%] top-[-8%] h-48 w-48 rounded-full blur-3xl ${sceneStyles[scene].glow} sm:h-64 sm:w-64`} />
    <div className="absolute right-[-4%] top-[12%] h-40 w-40 rounded-full bg-white/20 blur-3xl sm:h-56 sm:w-56" />
  </>
);

const Cloud = ({ className }: { className: string }) => (
  <div className={`absolute ${className}`}>
    <div className="absolute bottom-0 left-6 h-10 w-16 rounded-full bg-white/88 blur-[1px]" />
    <div className="absolute bottom-3 left-0 h-12 w-14 rounded-full bg-white/90 blur-[1px]" />
    <div className="absolute bottom-4 left-10 h-14 w-20 rounded-full bg-white/92 blur-[1px]" />
    <div className="absolute bottom-0 left-20 h-10 w-14 rounded-full bg-white/88 blur-[1px]" />
  </div>
);

const Bird = ({ className }: { className: string }) => (
  <div className={`absolute ${className}`}>
    <div className="absolute left-0 top-0 h-1 w-4 rounded-full bg-slate-600/45 rotate-[22deg]" />
    <div className="absolute left-3 top-0 h-1 w-4 rounded-full bg-slate-600/45 -rotate-[22deg]" />
  </div>
);

const SunFace = ({ theme }: { theme: HomeBackdropTheme }) => {
  if (theme === 'evening') {
    return (
      <div className="absolute right-8 top-10 h-16 w-16 rounded-full bg-yellow-100/95 shadow-[0_0_40px_rgba(254,240,138,0.45)] sm:right-16 sm:top-14 sm:h-20 sm:w-20">
        <div className="absolute right-2 top-1 h-16 w-16 rounded-full bg-indigo-900/92 sm:h-20 sm:w-20" />
      </div>
    );
  }

  return (
    <div className="absolute right-8 top-8 h-16 w-16 rounded-full bg-yellow-300 shadow-[0_0_50px_rgba(253,224,71,0.42)] sm:right-16 sm:top-10 sm:h-20 sm:w-20">
      <div className="absolute left-4 top-5 h-1.5 w-1.5 rounded-full bg-yellow-700 sm:left-5 sm:top-6" />
      <div className="absolute right-4 top-5 h-1.5 w-1.5 rounded-full bg-yellow-700 sm:right-5 sm:top-6" />
      <div className="absolute left-1/2 top-9 h-4 w-8 -translate-x-1/2 rounded-b-full border-b-2 border-yellow-700 sm:top-11" />
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="absolute left-1/2 top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/85 sm:h-12"
          style={{ transform: `translate(-50%, -50%) rotate(${index * 18}deg) translateY(-38px)` }}
        />
      ))}
    </div>
  );
};

const NightSparkles = ({ theme }: { theme: HomeBackdropTheme }) => {
  if (theme !== 'evening') return null;

  return (
    <>
      {[
        'left-[8%] top-[14%]',
        'left-[24%] top-[18%]',
        'left-[42%] top-[10%]',
        'left-[56%] top-[22%]',
        'right-[22%] top-[24%]',
        'right-[10%] top-[16%]',
      ].map((position) => (
        <div key={position} className={`absolute ${position} h-2 w-2 rounded-full bg-yellow-100/95 shadow-[0_0_10px_rgba(254,249,195,0.75)]`} />
      ))}
    </>
  );
};

const HillBand = ({ className }: { className: string }) => (
  <div className={`absolute inset-x-0 rounded-[50%] ${className}`} />
);

const Tree = ({ className }: { className: string }) => (
  <div className={`absolute ${className}`}>
    <div className="absolute bottom-0 left-1/2 h-12 w-3 -translate-x-1/2 rounded-full bg-amber-700/75" />
    <div className="absolute bottom-8 left-0 h-12 w-12 rounded-full bg-green-400/90" />
    <div className="absolute bottom-12 left-4 h-12 w-12 rounded-full bg-green-500/90" />
    <div className="absolute bottom-8 left-8 h-12 w-12 rounded-full bg-green-300/90" />
  </div>
);

const FlowerDots = ({ className }: { className: string }) => (
  <div className={`absolute ${className}`}>
    {Array.from({ length: 7 }).map((_, index) => (
      <div
        key={index}
        className="absolute h-2.5 w-2.5 rounded-full bg-white/85 shadow-[0_0_0_2px_rgba(253,224,71,0.35)]"
        style={{ left: `${index * 18}px`, top: `${(index % 2) * 6}px` }}
      />
    ))}
  </div>
);

const BikeSilhouette = ({ className, color }: { className: string; color: string }) => (
  <div className={`absolute ${className}`}>
    <div className={`absolute bottom-0 left-0 h-12 w-12 rounded-full border-[5px] ${color} bg-white/55`} />
    <div className={`absolute bottom-0 left-14 h-12 w-12 rounded-full border-[5px] ${color} bg-white/55`} />
    <div className={`absolute bottom-8 left-4 h-2 w-16 rounded-full rotate-[17deg] ${color}`} />
    <div className={`absolute bottom-[2.8rem] left-7 h-2 w-10 rounded-full rotate-[62deg] ${color}`} />
    <div className={`absolute bottom-[2.75rem] left-11 h-2 w-10 rounded-full -rotate-[44deg] ${color}`} />
    <div className={`absolute bottom-[3.4rem] left-[3.9rem] h-2 w-5 rounded-full ${color}`} />
    <div className={`absolute bottom-[3.8rem] left-[3.2rem] h-8 w-2 rounded-full ${color}`} />
  </div>
);

const Kite = ({ className, palette }: { className: string; palette: string }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{ y: [0, -6, 0], rotate: [0, 3, -2, 0] }}
    transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
  >
    <div className={`h-14 w-14 rotate-[10deg] border-[3px] ${palette} [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]`} />
    <div className="absolute left-1/2 top-10 h-24 w-[2px] -translate-x-1/2 rotate-[32deg] bg-sky-500/80" />
    <div className="absolute left-[55%] top-[4.3rem] text-sky-500/75">~</div>
    <div className="absolute left-[70%] top-[5.3rem] text-sky-500/70">~</div>
  </motion.div>
);

const Schoolhouse = () => (
  <div className="absolute bottom-16 left-[12%] h-28 w-28 sm:bottom-20 sm:h-32 sm:w-32">
    <div className="absolute bottom-0 left-4 h-20 w-20 rounded-[1.4rem] bg-rose-100/90 shadow-[0_10px_25px_rgba(251,113,133,0.18)]" />
    <div className="absolute bottom-14 left-1 h-12 w-[6.5rem] bg-rose-400/95 [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />
    <div className="absolute bottom-8 left-10 h-12 w-8 rounded-t-xl bg-sky-200/90" />
    <div className="absolute bottom-12 left-6 h-5 w-5 rounded-md bg-white/90" />
    <div className="absolute bottom-12 left-[4.25rem] h-5 w-5 rounded-md bg-white/90" />
  </div>
);

const Sandcastle = () => (
  <div className="absolute bottom-14 left-[18%] h-28 w-40 sm:bottom-16 sm:h-32 sm:w-48">
    <div className="absolute bottom-0 left-8 h-14 w-20 rounded-t-[2rem] bg-amber-300/95 border-4 border-amber-500/75" />
    <div className="absolute bottom-4 left-0 h-12 w-16 rounded-t-[1.5rem] bg-amber-200/95 border-4 border-amber-500/75" />
    <div className="absolute bottom-4 right-0 h-12 w-16 rounded-t-[1.5rem] bg-amber-200/95 border-4 border-amber-500/75" />
    <div className="absolute bottom-14 left-2 h-5 w-3 bg-pink-400/90" />
    <div className="absolute bottom-14 right-3 h-5 w-3 bg-sky-400/90" />
    <div className="absolute bottom-[4.2rem] left-2 h-3 w-7 bg-pink-300/95 [clip-path:polygon(0_0,100%_50%,0_100%)]" />
    <div className="absolute bottom-[4.2rem] right-3 h-3 w-7 bg-sky-300/95 [clip-path:polygon(0_0,100%_50%,0_100%)]" />
  </div>
);

const SceneArt = ({ scene }: { scene: HomeScene }) => {
  if (scene === 'bike') {
    return (
      <>
        <HillBand className="bottom-[20%] h-40 bg-emerald-200/85" />
        <HillBand className="bottom-[8%] h-44 bg-lime-300/80" />
        <div className="absolute inset-x-[8%] bottom-[12%] h-24 rounded-[50%] bg-[linear-gradient(180deg,rgba(253,186,116,0.15),rgba(245,158,11,0.55))] rotate-[-5deg]" />
        <div className="absolute inset-x-[18%] bottom-[13%] h-14 rounded-[50%] border-8 border-amber-300/90 border-t-0 border-l-0 border-r-0 rotate-[-4deg]" />
        <BikeSilhouette className="left-[18%] bottom-[18%] scale-90 sm:scale-100" color="border-violet-500 bg-violet-500" />
        <BikeSilhouette className="left-[40%] bottom-[22%] scale-110" color="border-rose-500 bg-rose-500" />
        <Tree className="right-[10%] bottom-[18%] h-28 w-24" />
        <Tree className="left-[7%] bottom-[20%] h-20 w-16 scale-75" />
        <FlowerDots className="left-[12%] bottom-[10%] w-32" />
        <Bird className="left-[20%] top-[18%]" />
        <Bird className="left-[27%] top-[14%] scale-125" />
      </>
    );
  }

  if (scene === 'school') {
    return (
      <>
        <HillBand className="bottom-[18%] h-36 bg-lime-200/85" />
        <HillBand className="bottom-[6%] h-44 bg-emerald-300/85" />
        <div className="absolute left-[-8%] top-[18%] h-16 w-[75%] rounded-full border-t-4 border-white/80 opacity-75" />
        <div className="absolute left-[8%] top-[24%] h-16 w-[72%] rounded-full border-t-4 border-white/70 opacity-70" />
        <div className="absolute left-[22%] top-[11%] h-12 w-12 rounded-full bg-yellow-300 shadow-[0_0_35px_rgba(253,224,71,0.35)]" />
        <Schoolhouse />
        <Tree className="right-[15%] bottom-[22%] h-28 w-24" />
        <Tree className="right-[28%] bottom-[17%] h-[4.5rem] w-16 scale-75" />
        <div className="absolute left-[34%] bottom-[18%] h-20 w-28 rounded-[50%] border-[10px] border-amber-200/80 border-t-0 border-l-0 border-r-0 rotate-[10deg]" />
        <FlowerDots className="right-[16%] bottom-[12%] w-32" />
      </>
    );
  }

  if (scene === 'kite') {
    return (
      <>
        <HillBand className="bottom-[22%] h-36 bg-lime-200/80" />
        <HillBand className="bottom-[8%] h-44 bg-green-300/85" />
        <HillBand className="bottom-[-4%] h-40 bg-lime-400/75" />
        <Kite className="left-[16%] top-[16%]" palette="border-orange-500 bg-[linear-gradient(135deg,#f59e0b_0%,#facc15_45%,#84cc16_45%,#65a30d_100%)]" />
        <Kite className="left-[44%] top-[12%] scale-90" palette="border-fuchsia-500 bg-[linear-gradient(135deg,#f472b6_0%,#ec4899_50%,#c084fc_50%,#8b5cf6_100%)]" />
        <Cloud className="left-[8%] top-[16%] h-20 w-36 opacity-90" />
        <Cloud className="right-[8%] top-[12%] h-24 w-40 opacity-90" />
        <Bird className="right-[16%] top-[22%] scale-125" />
        <Bird className="right-[8%] top-[16%]" />
        <Tree className="left-[4%] bottom-[16%] h-24 w-20 scale-90" />
        <Tree className="right-[3%] bottom-[16%] h-28 w-24" />
        <FlowerDots className="left-[28%] bottom-[10%] w-36" />
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-x-0 bottom-[16%] h-28 bg-[linear-gradient(180deg,rgba(103,232,249,0.15),rgba(34,211,238,0.55),rgba(8,145,178,0.78))]" />
      <div className="absolute inset-x-0 bottom-[11%] h-6 bg-white/35" />
      <div className="absolute inset-x-0 bottom-[4%] h-28 bg-[linear-gradient(180deg,rgba(254,240,138,0.2),rgba(253,224,71,0.58),rgba(251,191,36,0.8))]" />
      <Cloud className="left-[6%] top-[12%] h-24 w-40 opacity-90" />
      <Cloud className="right-[10%] top-[18%] h-20 w-32 opacity-90" />
      <Bird className="left-[18%] top-[20%] scale-125" />
      <Bird className="right-[23%] top-[26%] scale-110" />
      <Sandcastle />
      <div className="absolute left-[12%] bottom-[9%] h-10 w-10 rounded-full border-4 border-red-300 bg-yellow-200/80" />
      <div className="absolute left-[14.5%] bottom-[10.5%] h-6 w-1 rounded-full bg-red-400" />
      <div className="absolute right-[16%] bottom-[9%] h-11 w-11 rounded-full bg-sky-300/80 border-4 border-sky-500/60" />
      <div className="absolute right-[22%] bottom-[8%] h-3 w-14 rounded-full bg-amber-600/70 rotate-[25deg]" />
      <div className="absolute right-[9%] bottom-[15%] h-16 w-16 rounded-full bg-white/40" />
    </>
  );
};

export const HomeSceneBackdrop = ({ scene, theme }: HomeSceneBackdropProps) => {
  const styles = sceneStyles[scene];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[44px]">
      <div className={`absolute inset-0 bg-gradient-to-b ${styles.sky}`} />
      <SkyGlow scene={scene} />
      <SunFace theme={theme} />
      <NightSparkles theme={theme} />
      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`absolute inset-x-0 top-[38%] h-[24%] bg-gradient-to-b ${styles.horizon}`}
      />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className={`absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t ${styles.ground}`}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${themeOverlay[theme]}`} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <SceneArt scene={scene} />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_34%)] opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_70%,rgba(255,255,255,0.12)_100%)]" />
    </div>
  );
};
