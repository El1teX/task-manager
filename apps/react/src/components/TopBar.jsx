import { COLORS, THEME_LABELS } from '@beads/core';
import { ThemeIcon } from './Icons.jsx';

export default function TopBar({ theme, onThemeChange }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          {COLORS.slice(0, 3).map((c) => (
            <span key={c.id} style={{ '--c': c.value }} />
          ))}
        </span>
        Beads
      </div>
      <button
        type="button"
        className="icon-btn"
        onClick={onThemeChange}
        aria-label={`${THEME_LABELS[theme]}. Переключить`}
        title={THEME_LABELS[theme]}
      >
        <ThemeIcon theme={theme} />
      </button>
    </header>
  );
}
