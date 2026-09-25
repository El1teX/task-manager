<script setup>
import { computed } from 'vue';
import { formatDayMonth, isDone, toKey } from '@beads/core';

const props = defineProps({
  habit: { type: Object, required: true },
  days: { type: Array, required: true },
  todayKey: { type: String, required: true },
});
defineEmits(['toggle']);

const beads = computed(() =>
  props.days.map((day, i) => {
    const key = toKey(day);
    const done = isDone(props.habit, key);
    const isToday = key === props.todayKey;
    const label = `${formatDayMonth(day)}${isToday ? ', сегодня' : ''}`;
    return {
      key,
      done,
      label,
      linked: done && i > 0 && isDone(props.habit, toKey(props.days[i - 1])),
      isToday,
    };
  }),
);
</script>

<template>
  <div class="beads" role="group" :aria-label="`Отметки «${habit.name}» за ${days.length} дней`">
    <button
      v-for="b in beads"
      :key="b.key"
      type="button"
      class="bead"
      :class="{ 'is-done': b.done, 'is-linked': b.linked, 'is-today': b.isToday }"
      :aria-pressed="b.done"
      :aria-label="b.label"
      :title="`${b.label}: ${b.done ? 'выполнено' : 'не отмечено'}`"
      @click="$emit('toggle', b.key)"
    >
      <span class="bead__dot" />
    </button>
  </div>
</template>
