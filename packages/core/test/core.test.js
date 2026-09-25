import { describe, expect, it } from 'vitest';
import {
  bestStreak,
  completionRate,
  createHabit,
  currentStreak,
  heatmapWeeks,
  importState,
  isValidKey,
  loadState,
  normalizeState,
  plural,
  saveState,
  STORAGE_KEY,
  toggleDay,
  todayProgress,
} from '../src/index.js';

const today = new Date(2026, 8, 25); // пятница, 25 сентября 2026

function habitWith(keys, createdAt = '2026-09-01') {
  const h = createHabit({ name: 'Тест' }, new Date(2026, 8, 1));
  return { ...h, createdAt, done: Object.fromEntries(keys.map((k) => [k, true])) };
}

describe('даты', () => {
  it('проверяет ключи дней', () => {
    expect(isValidKey('2026-09-25')).toBe(true);
    expect(isValidKey('2026-02-30')).toBe(false);
    expect(isValidKey('25.09.2026')).toBe(false);
  });

  it('склоняет слова', () => {
    expect(plural(1, ['день', 'дня', 'дней'])).toBe('день');
    expect(plural(3, ['день', 'дня', 'дней'])).toBe('дня');
    expect(plural(11, ['день', 'дня', 'дней'])).toBe('дней');
    expect(plural(22, ['день', 'дня', 'дней'])).toBe('дня');
  });
});

describe('привычки', () => {
  it('не создаёт привычку без названия', () => {
    expect(() => createHabit({ name: '   ' })).toThrow();
  });

  it('переключает отметку иммутабельно', () => {
    const h = habitWith([]);
    const on = toggleDay(h, '2026-09-25');
    expect(on.done['2026-09-25']).toBe(true);
    expect(h.done['2026-09-25']).toBeUndefined();
    expect(toggleDay(on, '2026-09-25').done).toEqual({});
  });

  it('считает текущую серию, включая сегодня', () => {
    const h = habitWith(['2026-09-23', '2026-09-24', '2026-09-25']);
    expect(currentStreak(h, today)).toBe(3);
  });

  it('не обнуляет серию, если сегодня ещё не отмечено', () => {
    const h = habitWith(['2026-09-23', '2026-09-24']);
    expect(currentStreak(h, today)).toBe(2);
  });

  it('обнуляет серию после пропуска', () => {
    const h = habitWith(['2026-09-22', '2026-09-23']);
    expect(currentStreak(h, today)).toBe(0);
  });

  it('находит лучшую серию, в том числе через границу месяца', () => {
    const h = habitWith(['2026-08-30', '2026-08-31', '2026-09-01', '2026-09-05', '2026-09-06']);
    expect(bestStreak(h)).toBe(3);
  });

  it('считает процент только с начала отслеживания', () => {
    const h = habitWith(['2026-09-24', '2026-09-25'], '2026-09-22');
    expect(completionRate(h, 30, today)).toBe(50);
  });

  it('считает прогресс за сегодня', () => {
    const a = habitWith(['2026-09-25']);
    const b = habitWith([]);
    expect(todayProgress([a, b], today)).toEqual({ done: 1, total: 2 });
  });

  it('строит тепловую карту с понедельника, без будущих дней', () => {
    const weeks = heatmapWeeks(4, today);
    expect(weeks).toHaveLength(4);
    expect(weeks[0][0].getDay()).toBe(1);
    const last = weeks[3];
    expect(last[4].getDate()).toBe(25);
    expect(last[5]).toBeNull();
    expect(last[6]).toBeNull();
  });
});

describe('хранилище', () => {
  it('отбрасывает мусор при импорте', () => {
    const state = normalizeState({
      theme: 'neon',
      habits: [
        { id: 'a', name: '  Вода ', color: 'unknown', done: { '2026-09-25': true, bad: true, '2026-09-24': 'yes' } },
        { id: 'a', name: 'Дубль id' },
        { name: '' },
        null,
      ],
    });
    expect(state.theme).toBe('system');
    expect(state.habits).toHaveLength(2);
    expect(state.habits[0].name).toBe('Вода');
    expect(state.habits[0].color).toBe('moss');
    expect(state.habits[0].done).toEqual({ '2026-09-25': true });
    expect(state.habits[1].id).not.toBe('a');
  });

  it('понятно сообщает о неверном файле', () => {
    expect(() => importState('not json')).toThrow('не JSON');
    expect(() => importState('{"foo":1}')).toThrow('нет списка привычек');
  });

  it('сохраняет и загружает состояние', () => {
    const mem = new Map();
    const storage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
    const state = { version: 1, theme: 'dark', habits: [habitWith(['2026-09-25'])] };
    expect(saveState(state, storage)).toBe(true);
    expect(mem.has(STORAGE_KEY)).toBe(true);
    expect(loadState(storage)).toEqual(state);
  });

  it('возвращает пустое состояние при повреждённых данных', () => {
    const storage = { getItem: () => '{broken', setItem: () => {} };
    expect(loadState(storage).habits).toEqual([]);
  });
});
