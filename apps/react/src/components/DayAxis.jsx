import { formatWeekdayShort, toKey } from '@beads/core';

/** Подписи дней над бусинами. Отступ справа — под кнопку «изменить». */
export default function DayAxis({ days, todayKey }) {
  return (
    <div className="axis" aria-hidden="true" style={{ marginRight: 40 }}>
      {days.map((day) => (
        <span key={toKey(day)} className={toKey(day) === todayKey ? 'is-today' : undefined}>
          <b>{formatWeekdayShort(day)}</b>
          {day.getDate()}
        </span>
      ))}
    </div>
  );
}
