import { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Star, Sparkles, Heart, ChevronRight, CheckCircle2 } from 'lucide-react';

const T = {
  fonts: `'Fredoka', system-ui, sans-serif`,
  ink: '#3d2c1f',
  inkMute: '#8a7866',
  cream: '#fff9f0',
  creamDeep: '#f5ede2',
  white: '#ffffff',
  border: 'rgba(180,120,80,0.12)',
  orange: '#f97316',
  orangeHover: '#ea6c0e',
  orangeLight: '#fff1e8',
  shadow: '0 4px 24px rgba(180,120,80,0.13)',
  shadowHover: '0 8px 32px rgba(249,115,22,0.22)',
};

const FEATURES = [
  {
    icon: Sun,
    title: 'Morning magic',
    desc: 'Custom routines that guide each child through their morning — get dressed, brush teeth, pack the bag — without the nagging.',
    bg: 'linear-gradient(145deg,#f97316,#fdba74)',
    shadow: 'rgba(249,115,22,0.30)',
  },
  {
    icon: Moon,
    title: 'Calm evenings',
    desc: 'Wind-down checklists that help kids settle into bedtime — bath, reading, lights out — while parents stay sane.',
    bg: 'linear-gradient(145deg,#4338ca,#818cf8)',
    shadow: 'rgba(67,56,202,0.28)',
  },
  {
    icon: Star,
    title: 'Kids take charge',
    desc: 'A colourful, screen-time-friendly interface built for little hands. Tasks are tapped, not told. Streaks and stars keep motivation alive.',
    bg: 'linear-gradient(145deg,#047857,#6ee7b7)',
    shadow: 'rgba(4,120,87,0.28)',
  },
  {
    icon: Heart,
    title: 'One family, every device',
    desc: 'Parent account syncs routines, children, and progress across all devices. Set up once on a tablet; it just works on every phone.',
    bg: 'linear-gradient(145deg,#9d174d,#fda4af)',
    shadow: 'rgba(157,23,77,0.28)',
  },
];

const STEPS = [
  { n: '1', title: 'Create a free account', body: 'Enter your email and we send a magic sign-in link. No password to forget.' },
  { n: '2', title: 'Add your children', body: 'Give each child a name, pick an avatar, and choose their age. Takes about 60 seconds.' },
  { n: '3', title: 'Build the first routine', body: 'Pick tasks from the library or write your own. Drag to reorder. Done.' },
];

interface Props {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div data-testid="landing-page" style={{ fontFamily: T.fonts, background: T.cream, color: T.ink, minHeight: '100svh', overflowX: 'hidden' }}>

      {/* ── Floating nav ── */}
      <nav
        style={{
          position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)', maxWidth: 900, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 18px',
          background: scrolled ? 'rgba(255,249,240,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderRadius: 99, border: scrolled ? `1.5px solid ${T.border}` : '1.5px solid transparent',
          boxShadow: scrolled ? T.shadow : 'none',
          transition: 'all 220ms ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg,#f97316,#fdba74)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(249,115,22,0.30)',
          }}>
            <Star size={16} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>Routine Stars</span>
        </div>
        <button
          onClick={onGetStarted}
          style={{
            background: T.orange, color: '#fff', border: 'none',
            borderRadius: 99, padding: '8px 20px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: T.fonts, letterSpacing: '0.01em',
            boxShadow: '0 4px 0 rgba(0,0,0,0.10)',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.orangeHover; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.orange; (e.currentTarget as HTMLButtonElement).style.transform = ''; }}
        >
          Get started
        </button>
      </nav>

      {/* ── Hero ── */}
      <div
        ref={heroRef}
        style={{
          minHeight: '100svh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '100px 24px 80px', textAlign: 'center', position: 'relative',
        }}
      >
        {/* Blobs */}
        <div style={{ position: 'absolute', top: '8%', left: '-5%', width: 500, height: 400, borderRadius: '50%', background: 'rgba(249,115,22,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-8%', width: 420, height: 420, borderRadius: '50%', background: 'rgba(67,56,202,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '60%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(4,120,87,0.05)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: T.orangeLight, borderRadius: 99, padding: '6px 16px',
          fontSize: 13, fontWeight: 700, color: T.orange,
          letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 28,
          border: `1.5px solid rgba(249,115,22,0.15)`,
        }}>
          <Sparkles size={13} />
          Free for families
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 700, lineHeight: 1.08,
          margin: '0 0 22px', maxWidth: 760,
          background: 'linear-gradient(135deg, #3d2c1f 30%, #f97316)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Mornings that&nbsp;run themselves
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: T.inkMute, lineHeight: 1.65,
          maxWidth: 560, margin: '0 0 40px',
        }}>
          Routine Stars gives every child a colourful, tap-through checklist for mornings and evenings — so you can hand over the reins and drink your coffee while it's still hot.
        </p>

        {/* CTA group */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={onGetStarted}
            style={{
              background: T.orange, color: '#fff', border: 'none',
              borderRadius: 99, padding: '16px 36px',
              fontSize: 17, fontWeight: 700, cursor: 'pointer',
              fontFamily: T.fonts, letterSpacing: '0.01em',
              boxShadow: `0 6px 0 rgba(0,0,0,0.10), 0 12px 32px rgba(249,115,22,0.28)`,
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 180ms ease',
            }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(-2px)'; b.style.boxShadow = `0 8px 0 rgba(0,0,0,0.10), 0 16px 40px rgba(249,115,22,0.36)`; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = ''; b.style.boxShadow = `0 6px 0 rgba(0,0,0,0.10), 0 12px 32px rgba(249,115,22,0.28)`; }}
          >
            Create your first routine
            <ChevronRight size={18} />
          </button>
          <span style={{ fontSize: 13, color: T.inkMute }}>No credit card · Free forever</span>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: 52, display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: CheckCircle2, text: 'Works on any device' },
            { icon: CheckCircle2, text: 'Cloud sync included' },
            { icon: CheckCircle2, text: 'Kids use it independently' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: T.inkMute }}>
              <Icon size={15} color={T.orange} />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ padding: '0 24px 100px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, margin: '0 0 12px' }}>
            Everything a family needs
          </h2>
          <p style={{ fontSize: 16, color: T.inkMute, maxWidth: 480, margin: '0 auto' }}>
            Built for the real chaos of family mornings — and the quiet magic of bedtime.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 18,
        }}>
          {FEATURES.map(({ icon: Icon, title, desc, bg, shadow }) => (
            <div
              key={title}
              style={{
                background: T.white, borderRadius: 24,
                padding: '26px 22px',
                border: `1.5px solid ${T.border}`,
                boxShadow: T.shadow,
                transition: 'transform 200ms ease, box-shadow 200ms ease',
                cursor: 'default',
              }}
              onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(-4px)'; d.style.boxShadow = `0 12px 36px rgba(180,120,80,0.15)`; }}
              onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = ''; d.style.boxShadow = T.shadow; }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
                boxShadow: `0 6px 18px ${shadow}`,
              }}>
                <Icon size={24} color="#fff" strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 14, color: T.inkMute, lineHeight: 1.65 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{ background: T.creamDeep, padding: '80px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, margin: '0 0 12px' }}>
            Up and running in minutes
          </h2>
          <p style={{ fontSize: 16, color: T.inkMute, marginBottom: 52 }}>
            No tutorial needed. Most families have their first routine live in under five minutes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left' }}>
            {STEPS.map(({ n, title, body }) => (
              <div
                key={n}
                style={{
                  background: T.white, borderRadius: 22, padding: '22px 24px',
                  border: `1.5px solid ${T.border}`,
                  boxShadow: T.shadow,
                  display: 'flex', alignItems: 'flex-start', gap: 20,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                  background: T.orangeLight, border: `2px solid rgba(249,115,22,0.20)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, color: T.orange,
                }}>
                  {n}
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 14, color: T.inkMute, lineHeight: 1.65 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(249,115,22,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22, margin: '0 auto 24px',
            background: 'linear-gradient(135deg,#f97316,#fdba74)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(249,115,22,0.32)',
          }}>
            <Star size={34} color="#fff" fill="#fff" />
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, margin: '0 0 16px' }}>
            Ready for calmer mornings?
          </h2>
          <p style={{ fontSize: 16, color: T.inkMute, lineHeight: 1.65, marginBottom: 36 }}>
            Join families who've replaced the daily chaos with a simple routine their kids actually follow.
          </p>

          <button
            onClick={onGetStarted}
            style={{
              background: T.orange, color: '#fff', border: 'none',
              borderRadius: 99, padding: '18px 44px',
              fontSize: 18, fontWeight: 700, cursor: 'pointer',
              fontFamily: T.fonts,
              boxShadow: `0 6px 0 rgba(0,0,0,0.10), 0 14px 36px rgba(249,115,22,0.30)`,
              display: 'inline-flex', alignItems: 'center', gap: 10,
              transition: 'all 180ms ease',
            }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(-2px)'; b.style.boxShadow = `0 8px 0 rgba(0,0,0,0.10), 0 20px 44px rgba(249,115,22,0.38)`; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = ''; b.style.boxShadow = `0 6px 0 rgba(0,0,0,0.10), 0 14px 36px rgba(249,115,22,0.30)`; }}
          >
            Start for free
            <ChevronRight size={20} />
          </button>

          <p style={{ marginTop: 16, fontSize: 13, color: T.inkMute }}>
            Free forever · No app store needed · Works on any browser
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: `1.5px solid ${T.border}`, padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: 'linear-gradient(135deg,#f97316,#fdba74)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Star size={12} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Routine Stars</span>
        </div>
        <p style={{ fontSize: 12, color: T.inkMute, margin: 0 }}>
          Made with love for families everywhere.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
