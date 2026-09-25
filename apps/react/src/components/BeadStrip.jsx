import { formatDayMonth, isDone, toKey } from '@beads/core';

export default function BeadStrip({ habit, days, todayKey, onToggle }) {
  return (
    <div className="beads" role="group" aria-label={`Отметки «${habit.name}» за ${days.length} дней`}>
      {days.map((day, i) => {
        const key = toKey(day);
        const done = isDone(habit, key);
        const linked = done && i > 0 && isDone(habit, toKey(days[i - 1]));
        const isToday = key === todayKey;
        const label = `${formatDayMonth(day)}${isToday ? ', сегодня' : ''}`;
        const className = ['bead', done && 'is-done', linked && 'is-linked', isToday && 'is-today']
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={key}
            type="button"
            className={className}
            aria-pressed={done}
            aria-label={label}
            title={`${label}: ${done ? 'выполнено' : 'не отмечено'}`}
            onClick={() => onToggle(key)}
          >
            <span className="bead__dot" />
          </button>
        );
      })}
    </div>
  );
}
