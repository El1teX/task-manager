import { colorValue, currentStreak, plural } from '@beads/core';
import BeadStrip from './BeadStrip.jsx';
import { EditIcon } from './Icons.jsx';

function streakText(n) {
  if (n === 0) return 'Серии пока нет';
  return `${n} ${plural(n, ['день', 'дня', 'дней'])} подряд`;
}

export default function HabitRow({ habit, days, today, todayKey, selected, onSelect, onToggle, onEdit }) {
  const streak = currentStreak(habit, today);

  return (
    <li className={`habit${selected ? ' is-selected' : ''}`} style={{ '--c': colorValue(habit.color) }}>
      <div className="habit__main">
        <span className="habit__emoji" aria-hidden="true">
          {habit.emoji}
        </span>
        <div className="habit__text">
          <button
            type="button"
            className="habit__name"
            onClick={onSelect}
            aria-pressed={selected}
            title="Показать статистику"
          >
            {habit.name}
          </button>
          <span className="habit__streak">{streakText(streak)}</span>
        </div>
      </div>
      <div className="habit__side">
        <BeadStrip habit={habit} days={days} todayKey={todayKey} onToggle={onToggle} />
        <button type="button" className="icon-btn" onClick={onEdit} aria-label={`Изменить «${habit.name}»`}>
          <EditIcon />
        </button>
      </div>
    </li>
  );
}
