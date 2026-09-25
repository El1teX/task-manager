import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { STORAGE_KEY, createHabit, loadState, saveState, toggleDay } from '@beads/core';

/** Состояние приложения + сохранение в localStorage + синхронизация между вкладками. */
export function useHabits() {
  const state = ref(loadState());
  const saveFailed = ref(false);

  watch(
    state,
    (value) => {
      saveFailed.value = !saveState(value);
    },
    { deep: true, immediate: true },
  );

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) state.value = loadState();
  };
  onMounted(() => window.addEventListener('storage', onStorage));
  onBeforeUnmount(() => window.removeEventListener('storage', onStorage));

  const findIndex = (id) => state.value.habits.findIndex((h) => h.id === id);

  function addHabit(data) {
    const habit = createHabit(data);
    state.value.habits.push(habit);
    return habit;
  }

  function updateHabit(id, patch) {
    const i = findIndex(id);
    if (i === -1) return;
    const current = state.value.habits[i];
    state.value.habits[i] = { ...current, ...patch, name: patch.name?.trim() ?? current.name };
  }

  function deleteHabit(id) {
    state.value.habits = state.value.habits.filter((h) => h.id !== id);
  }

  function toggle(id, key) {
    const i = findIndex(id);
    if (i !== -1) state.value.habits[i] = toggleDay(state.value.habits[i], key);
  }

  function setTheme(theme) {
    state.value.theme = theme;
  }

  function replaceState(next) {
    state.value = next;
  }

  return { state, saveFailed, addHabit, updateHabit, deleteHabit, toggle, setTheme, replaceState };
}
