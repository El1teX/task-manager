<script setup>
import { computed } from 'vue';
import { HEATMAP_WEEKS, bestStreak, colorValue, completionRate, currentStreak, totalDone } from '@beads/core';
import Heatmap from './Heatmap.vue';

const props = defineProps({
  habit: { type: Object, default: null },
  today: { type: Date, required: true },
});

const items = computed(() => {
  const h = props.habit;
  if (!h) return [];
  return [
    ['Текущая серия', currentStreak(h, props.today)],
    ['Лучшая серия', bestStreak(h)],
    ['За 30 дней', `${completionRate(h, 30, props.today)}%`],
    ['Всего отметок', totalDone(h)],
  ];
});
</script>

<template>
  <aside v-if="!habit" class="stats" aria-label="Статистика">
    <p class="stats__hint">Здесь появится статистика, когда вы добавите первую привычку.</p>
  </aside>
  <aside v-else class="stats" :aria-label="`Статистика «${habit.name}»`" :style="{ '--c': colorValue(habit.color) }">
    <h2 class="stats__title">
      <span aria-hidden="true">{{ habit.emoji }}</span> {{ habit.name }}
    </h2>
    <dl class="stats__grid">
      <div v-for="[label, value] in items" :key="label">
        <dt>{{ label }}</dt>
        <dd>{{ value }}</dd>
      </div>
    </dl>
    <p class="stats__caption">Последние {{ HEATMAP_WEEKS }} недель, с понедельника</p>
    <Heatmap :habit="habit" :today="today" :weeks="HEATMAP_WEEKS" />
  </aside>
</template>
