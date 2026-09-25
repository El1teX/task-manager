import { onBeforeUnmount, onMounted, ref } from 'vue';
import { addDays, startOfDay, toKey } from '@beads/core';

/** Текущий день, который сам обновляется в полночь и при возвращении на вкладку. */
export function useToday() {
  const today = ref(startOfDay());
  let timer = null;

  function schedule() {
    clearTimeout(timer);
    const ms = addDays(today.value, 1).getTime() - Date.now() + 1000;
    timer = setTimeout(refresh, Math.max(ms, 1000));
  }

  function refresh() {
    const now = startOfDay();
    if (toKey(now) !== toKey(today.value)) today.value = now;
    schedule();
  }

  onMounted(() => {
    schedule();
    document.addEventListener('visibilitychange', refresh);
  });

  onBeforeUnmount(() => {
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', refresh);
  });

  return today;
}
