import { useCallback, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEY, createHabit, loadState, saveState, toggleDay } from '@beads/core';

/** Состояние приложения + сохранение в localStorage + синхронизация между вкладками. */
export function useHabits() {
  const [state, setState] = useState(() => loadState());
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    setSaveFailed(!saveState(state));
  }, [state]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setState(loadState());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const mapHabit = useCallback(
    (id, fn) => setState((s) => ({ ...s, habits: s.habits.map((h) => (h.id === id ? fn(h) : h)) })),
    [],
  );

  const actions = useMemo(
    () => ({
      addHabit(data) {
        const habit = createHabit(data);
        setState((s) => ({ ...s, habits: [...s.habits, habit] }));
        return habit;
      },
      updateHabit(id, patch) {
        mapHabit(id, (h) => ({ ...h, ...patch, name: patch.name?.trim() ?? h.name }));
      },
      deleteHabit(id) {
        setState((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }));
      },
      toggle(id, key) {
        mapHabit(id, (h) => toggleDay(h, key));
      },
      setTheme(theme) {
        setState((s) => ({ ...s, theme }));
      },
      replaceState(next) {
        setState(next);
      },
    }),
    [mapHabit],
  );

  return { state, saveFailed, ...actions };
}
