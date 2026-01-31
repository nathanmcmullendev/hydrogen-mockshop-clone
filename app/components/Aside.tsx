import {useEffect} from 'react';

/**
 * A side bar component with Overlay
 * Supports both left (menu) and right (cart/search) positioning
 */
export function Aside({
  children,
  heading,
  id = 'aside',
  position = 'right',
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
  position?: 'left' | 'right';
}) {
  useEffect(() => {
    // Close aside when pressing Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && window.location.hash === `#${id}`) {
        window.location.hash = '';
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [id]);

  const handleCloseOutside = () => {
    window.location.hash = '';
  };

  return (
    <div
      aria-modal
      className={`overlay ${position === 'left' ? 'overlay-left' : ''}`}
      id={id}
      role="dialog"
    >
      <div
        className="close-outside"
        onClick={handleCloseOutside}
        onKeyDown={(e) => e.key === 'Enter' && handleCloseOutside()}
        role="button"
        tabIndex={0}
        aria-label="Close"
      />
      <aside className={position === 'left' ? 'aside-left' : ''}>
        <header>
          {position === 'left' ? (
            <>
              <CloseAside />
              <div className="aside-header-spacer" />
            </>
          ) : (
            <>
              <h3>{heading}</h3>
              <CloseAside />
            </>
          )}
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    <a
      className="close"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.location.hash = '';
      }}
    >
      &times;
    </a>
  );
}
