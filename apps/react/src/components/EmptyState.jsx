import { PlusIcon } from './Icons.jsx';

export const EXAMPLES = [
  { name: 'Пить воду', emoji: '💧', color: 'cobalt' },
  { name: 'Читать 20 минут', emoji: '📚', color: 'plum' },
  { name: 'Прогулка', emoji: '🌿', color: 'moss' },
];

export default function EmptyState({ onCreate, onQuickAdd }) {
  return (
    <div className="empty">
      <div className="empty__thread" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <h2>Нитка пока пустая</h2>
      <p>
        Добавьте привычку и отмечайте каждый день, когда её выполнили. Дни подряд соединятся цветной нитью —
        так видно, сколько вы держитесь.
      </p>
      <div className="empty__examples">
        <button type="button" className="btn btn--primary" onClick={onCreate}>
          <PlusIcon /> Добавить привычку
        </button>
        {EXAMPLES.map((ex) => (
          <button key={ex.name} type="button" className="btn" onClick={() => onQuickAdd(ex)}>
            {ex.emoji} {ex.name}
          </button>
        ))}
      </div>
    </div>
  );
}
