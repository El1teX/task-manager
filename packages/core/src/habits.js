import { addDays, fromKey, lastNDays, startOfDay, toKey, weekdayIndex } from './dates.js';

export const COLORS = [
  { id: 'moss', value: '#4F8A5B', label: 'Мох' },
  { id: 'cobalt', value: '#3A5CCC', label: 'Кобальт' },
  { id: 'plum', value: '#8A4FA0', label: 'Слива' },
  { id: 'ochre', value: '#C08A1E', label: 'Охра' },
  { id: 'teal', value: '#2A8A8C', label: 'Бирюза' },
  { id: 'rose', value: '#C0406A', label: 'Роза' },
];

export const EMOJIS = ['🌿', '💧', '📚', '🏃', '🧘', '🥦', '😴', '✍️', '🎸', '🧠', '💪', '🚭'];

export const NAME_MAX_LENGTH = 60;

export function colorValue(colorId) {
  return (COLORS.find((c) => c.id === colorId) ?? COLORS[0]).value;
}

export function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export function createHabit({ name, emoji = EMOJIS[0], color = COLORS[0].id }, now = new Date()) {
  const cleanName = String(name ?? '').trim().slice(0, NAME_MAX_LENGTH);
  if (!cleanName) throw new Error('У привычки должно быть название.');
  return { id: createId(), name: cleanName, emoji, color, createdAt: toKey(now), done: {} };
}

export function isDone(habit, key) {
  return habit.done[key] === true;
}

/** Возвращает новую привычку с переключённой отметкой (иммутабельно). */
export function toggleDay(habit, key) {
  const done = { ...habit.done };
  if (done[key]) delete done[key];
  else done[key] = true;
  return { ...habit, done };
}

/**
 * Текущая серия. Если сегодня ещё не отмечено, серия считается до вчера —
 * день ещё не закончился, и серия не должна обнуляться с утра.
 */
export function currentStreak(habit, today = new Date()) {
  let day = startOfDay(today);
  if (!isDone(habit, toKey(day))) day = addDays(day, -1);
  let count = 0;
  while (isDone(habit, toKey(day))) {
    count += 1;
    day = addDays(day, -1);
  }
  return count;
}

export function bestStreak(habit) {
  const keys = Object.keys(habit.done).filter((k) => habit.done[k]).sort();
  let best = 0;
  let run = 0;
  let prev = null;
  for (const key of keys) {
    run = prev && toKey(addDays(prev, 1)) === key ? run + 1 : 1;
    best = Math.max(best, run);
    prev = fromKey(key);
  }
  return best;
}

export function totalDone(habit) {
  return Object.values(habit.done).filter(Boolean).length;
}

/** Процент выполнения за последние `days` дней (не раньше начала отслеживания). */
export function completionRate(habit, days = 30, today = new Date()) {
  const doneKeys = Object.keys(habit.done).sort();
  const firstKey = [habit.createdAt, doneKeys[0]].filter(Boolean).sort()[0];
  const first = firstKey ? fromKey(firstKey) : startOfDay(today);
  const range = lastNDays(days, today).filter((d) => d >= first);
  if (range.length === 0) return 0;
  const done = range.filter((d) => isDone(habit, toKey(d))).length;
  return Math.round((done / range.length) * 100);
}

export function todayProgress(habits, today = new Date()) {
  const key = toKey(today);
  return { done: habits.filter((h) => isDone(h, key)).length, total: habits.length };
}

/**
 * Сетка для тепловой карты: массив недель (колонок), в каждой 7 дат с пн по вс.
 * Будущие дни — null.
 */
export function heatmapWeeks(weeks = 16, today = new Date()) {
  const base = startOfDay(today);
  const start = addDays(base, -weekdayIndex(base) - (weeks - 1) * 7);
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, w * 7 + i);
      return date > base ? null : date;
    }),
  );
}
