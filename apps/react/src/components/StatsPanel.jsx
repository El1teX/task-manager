import { HEATMAP_WEEKS, bestStreak, colorValue, completionRate, currentStreak, totalDone } from '@beads/core';
import Heatmap from './Heatmap.jsx';

export default function StatsPanel({ habit, today }) {
  if (!habit) {
    return (
      <aside className="stats" aria-label="Статистика">
        <p className="stats__hint">Здесь появится статистика, когда вы добавите первую привычку.</p>
      </aside>
    );
  }

  const items = [
    ['Текущая серия', currentStreak(habit, today)],
    ['Лучшая серия', bestStreak(habit)],
    ['За 30 дней', `${completionRate(habit, 30, today)}%`],
    ['Всего отметок', totalDone(habit)],
  ];

  return (
    <aside className="stats" aria-label={`Статистика «${habit.name}»`} style={{ '--c': colorValue(habit.color) }}>
      <h2 className="stats__title">
        <span aria-hidden="true">{habit.emoji}</span> {habit.name}
      </h2>
      <dl className="stats__grid">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="stats__caption">Последние {HEATMAP_WEEKS} недель, с понедельника</p>
      <Heatmap habit={habit} today={today} weeks={HEATMAP_WEEKS} />
    </aside>
  );
}
