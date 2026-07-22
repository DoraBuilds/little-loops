import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';

const findKidEditorTabs = (): { container: HTMLElement; routinesButton: HTMLButtonElement } | null => {
  const buttons = Array.from(document.querySelectorAll('button'));
  const profileButton = buttons.find((button) => button.textContent?.trim().includes('Profile'));
  const routinesButton = buttons.find((button) => button.textContent?.trim().includes('Routines'));

  if (!profileButton || !routinesButton || profileButton.parentElement !== routinesButton.parentElement) {
    return null;
  }

  return {
    container: routinesButton.parentElement,
    routinesButton: routinesButton as HTMLButtonElement,
  };
};

export const ParentSchedulesNavItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [routinesButton, setRoutinesButton] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (location.pathname !== '/') {
      setTarget(null);
      setRoutinesButton(null);
      return;
    }

    const refresh = () => {
      const tabs = findKidEditorTabs();
      setTarget(tabs?.container ?? null);
      setRoutinesButton(tabs?.routinesButton ?? null);
    };

    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/parent/schedules') return;

    let cleanup: (() => void) | undefined;

    const attach = () => {
      const backButton = Array.from(document.querySelectorAll('button')).find(
        (button) => button.textContent?.trim() === '← Back'
      );
      if (!backButton) return;

      const handleBack = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
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
  }, [location.pathname, navigate]);

  if (!target) return null;

  const scheduleButton = (
    <button
      type="button"
      onClick={() => navigate('/parent/schedules')}
      style={{
        padding: '8px 14px',
        borderRadius: 10,
        border: 'none',
        background: 'transparent',
        color: '#8a7866',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        transition: 'all 0.15s',
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.background = '#ffffff';
        event.currentTarget.style.color = '#3d2c1f';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = 'transparent';
        event.currentTarget.style.color = '#8a7866';
      }}
    >
      📅 Schedule
    </button>
  );

  if (routinesButton?.nextSibling) {
    return createPortal(
      <span style={{ display: 'contents' }}>{scheduleButton}</span>,
      target
    );
  }

  return createPortal(scheduleButton, target);
};
