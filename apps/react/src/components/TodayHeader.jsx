import { colorValue, formatDayMonth, formatWeekday, isDone, toKey, todayProgress } from '@beads/core';

function summary(done, total) {
  if (total === 0) return 'Пока нечего отмечать — добавьте привычку.';
  if (done === total) return `Всё на сегодня выполнено: ${done} из ${total}.`;
  return (
    <>
      Сегодня выполнено <strong>{done} из {total}</strong>.
    </>
  );
}

export default function TodayHeader({ today, habits }) {
  const { done, total } = todayProgress(habits, today);
  const key = toKey(today);

  return (
    <section className="today" aria-labelledby="today-heading">
      <h1 id="today-heading" style={{ margin: 0 }}>
        <span className="today__weekday">{formatWeekday(today)},</span>
        <span className="today__date">{formatDayMonth(today)}</span>
      </h1>
      <div className="today__progress">
        {total > 0 && (
          <div className="today-thread" aria-hidden="true">
            {habits.map((h) => (
              <span
                key={h.id}
                className={isDone(h, key) ? 'is-done' : undefined}
                style={{ '--c': colorValue(h.color) }}
              />
            ))}
          </div>
        )}
        <p className="today__summary" aria-live="polite">
          {summary(done, total)}
        </p>
      </div>
    </section>
  );
}
