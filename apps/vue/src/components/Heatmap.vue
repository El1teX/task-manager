<script setup>
import { computed } from 'vue';
import { formatDayMonth, heatmapWeeks, isDone, toKey } from '@beads/core';

const props = defineProps({
  habit: { type: Object, required: true },
  today: { type: Date, required: true },
  weeks: { type: Number, required: true },
});

const cells = computed(() => {
  const todayKey = toKey(props.today);
  return heatmapWeeks(props.weeks, props.today)
    .flat()
    .map((day, i) => {
      if (!day) return { id: `f${i}`, future: true };
      const key = toKey(day);
      const done = isDone(props.habit, key);
      return {
        id: key,
        done,
        isToday: key === todayKey,
        title: `${formatDayMonth(day)}: ${done ? 'выполнено' : 'нет отметки'}`,
      };
    });
});
</script>

<template>
  <div class="heatmap" role="img" :aria-label="`Отметки за последние ${weeks} недель`">
    <span
      v-for="cell in cells"
      :key="cell.id"
      :class="{ 'is-future': cell.future, 'is-done': cell.done, 'is-today': cell.isToday }"
      :title="cell.title"
    />
  </div>
</template>
