import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';

const findParentSettingsNav = (): HTMLElement | null => {
  const buttons = Array.from(document.querySelectorAll('button'));
  const kidsButton = buttons.find((button) => button.textContent?.trim().startsWith('Kids'));
  const parentsButton = buttons.find((button) => button.textContent?.trim().startsWith('Parents'));
  if (!kidsButton || !parentsButton || kidsButton.parentElement !== parentsButton.parentElement) return null;
  return kidsButton.parentElement;
};

export const ParentSchedulesNavItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (location.pathname !== '/') {
      setTarget(null);
      return;
    }

    const refresh = () => setTarget(findParentSettingsNav());
    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/parent/schedules' || !location.state?.fromParentSettings) return;

    let cleanup: (() => void) | undefined;
    const attach = () => {
      const backButton = Array.from(document.querySelectorAll('button')).find(
        (button) => button.textContent?.trim() === '← Back'
      );
      if (!backButton) return;

      const handleBack = (event: Event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        navigate(-1);
      };
      backButton.addEventListener('click', handleBack, true);
      cleanup = () => backButton.removeEventListener('click', handleBack, true);
    };

    attach();
    const observer = new MutationObserver(() => {
      cleanup?.();
      cleanup = undefined;
      attach();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, [location.pathname, location.state, navigate]);

  if (!target) return null;

  return createPortal(
    <button
      type="button"
      onClick={() => navigate('/parent/schedules', { state: { fromParentSettings: true } })}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '10px 12px',
        borderRadius: 14,
        border: 'none',
        textAlign: 'left',
        background: 'transparent',
        color: '#3d2c1f',
        cursor: 'pointer',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        transition: 'all 0.15s',
      }}
      onMouseEnter={(event) => { event.currentTarget.style.background = '#fff1e8'; }}
      onMouseLeave={(event) => { event.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 16 }}>📅</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Schedules</div>
        <div style={{ fontSize: 15, opacity: 0.75, marginTop: 1 }}>Daily and holiday plans</div>
      </div>
    </button>,
    target
  );
};
