import { isValidKey, toKey } from './dates.js';
import { COLORS, EMOJIS, NAME_MAX_LENGTH, createId } from './habits.js';

export const STORAGE_KEY = 'beads:v1';
export const THEMES = ['system', 'light', 'dark'];

export const THEME_LABELS = {
  system: 'Тема: как в системе',
  light: 'Тема: светлая',
  dark: 'Тема: тёмная',
};

export function defaultState() {
  return { version: 1, habits: [], theme: 'system' };
}

function sanitizeDone(done) {
  const result = {};
  if (done && typeof done === 'object') {
    for (const [key, value] of Object.entries(done)) {
      if (value === true && isValidKey(key)) result[key] = true;
    }
  }
  return result;
}

/** Проверяет и нормализует данные (из localStorage или из импортированного файла). */
export function normalizeState(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.habits)) {
    throw new Error('Файл не похож на резервную копию Beads: в нём нет списка привычек.');
  }
  const seen = new Set();
  const habits = data.habits
    .filter((h) => h && typeof h === 'object' && typeof h.name === 'string' && h.name.trim())
    .map((h) => {
      let id = typeof h.id === 'string' && h.id ? h.id : createId();
      if (seen.has(id)) id = createId();
      seen.add(id);
      return {
        id,
        name: h.name.trim().slice(0, NAME_MAX_LENGTH),
        emoji: typeof h.emoji === 'string' && h.emoji ? h.emoji : EMOJIS[0],
        color: COLORS.some((c) => c.id === h.color) ? h.color : COLORS[0].id,
        createdAt: isValidKey(h.createdAt) ? h.createdAt : toKey(new Date()),
        done: sanitizeDone(h.done),
      };
    });
  return {
    version: 1,
    habits,
    theme: THEMES.includes(data.theme) ? data.theme : 'system',
  };
}

export function loadState(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    return raw ? normalizeState(JSON.parse(raw)) : defaultState();
  } catch {
    return defaultState();
  }
}

export function saveState(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function exportState(state) {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

export function importState(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Не удалось прочитать файл: это не JSON.');
  }
  return normalizeState(data);
}

/** Скачивает резервную копию (только в браузере). */
export function downloadState(state) {
  const blob = new Blob([exportState(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `beads-${toKey(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Применяет тему к <html>: data-theme="light|dark" или без атрибута для системной. */
export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
  else delete root.dataset.theme;
}

export function nextTheme(theme) {
  return THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
}
