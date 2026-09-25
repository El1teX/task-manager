import { formatDayMonth, heatmapWeeks, isDone, toKey } from '@beads/core';

export default function Heatmap({ habit, today, weeks }) {
  const grid = heatmapWeeks(weeks, today);
  const todayKey = toKey(today);

  return (
    <div className="heatmap" role="img" aria-label={`Отметки за последние ${weeks} недель`}>
      {grid.flat().map((day, i) => {
        if (!day) return <span key={`f${i}`} className="is-future" />;
        const key = toKey(day);
        const done = isDone(habit, key);
        const cls = [done && 'is-done', key === todayKey && 'is-today'].filter(Boolean).join(' ');
        return (
          <span
            key={key}
            className={cls || undefined}
            title={`${formatDayMonth(day)}: ${done ? 'выполнено' : 'нет отметки'}`}
          />
        );
      })}
    </div>
  );
}
