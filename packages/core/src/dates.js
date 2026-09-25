// Работа с датами. Дни храним как строки 'YYYY-MM-DD' в локальном времени,
// чтобы отметка не «переезжала» на соседний день из-за часовых поясов.

export function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isValidKey(key) {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  return toKey(fromKey(key)) === key;
}

/** Последние n дней, заканчивая сегодняшним (по возрастанию). */
export function lastNDays(n, today = new Date()) {
  const base = startOfDay(today);
  return Array.from({ length: n }, (_, i) => addDays(base, i - (n - 1)));
}

/** Индекс дня недели, где понедельник = 0. */
export function weekdayIndex(date) {
  return (date.getDay() + 6) % 7;
}

const longFmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' });
const dayMonthFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
const shortWeekdayFmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' });

export function formatWeekday(date) {
  const s = longFmt.format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatDayMonth(date) {
  return dayMonthFmt.format(date);
}

export function formatWeekdayShort(date) {
  return shortWeekdayFmt.format(date);
}

/** Русское склонение: plural(5, ['день', 'дня', 'дней']) → 'дней'. */
export function plural(n, [one, few, many]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
