<script setup>
import { computed } from 'vue';
import { colorValue, formatDayMonth, formatWeekday, isDone, toKey, todayProgress } from '@beads/core';

const props = defineProps({
  today: { type: Date, required: true },
  habits: { type: Array, required: true },
});

const progress = computed(() => todayProgress(props.habits, props.today));
const todayKey = computed(() => toKey(props.today));
</script>

<template>
  <section class="today" aria-labelledby="today-heading">
    <h1 id="today-heading" style="margin: 0">
      <span class="today__weekday">{{ formatWeekday(today) }},</span>
      <span class="today__date">{{ formatDayMonth(today) }}</span>
    </h1>
    <div class="today__progress">
      <div v-if="progress.total > 0" class="today-thread" aria-hidden="true">
        <span
          v-for="h in habits"
          :key="h.id"
          :class="{ 'is-done': isDone(h, todayKey) }"
          :style="{ '--c': colorValue(h.color) }"
        />
      </div>
      <p class="today__summary" aria-live="polite">
        <template v-if="progress.total === 0">Пока нечего отмечать — добавьте привычку.</template>
        <template v-else-if="progress.done === progress.total">
          Всё на сегодня выполнено: {{ progress.done }} из {{ progress.total }}.
        </template>
        <template v-else>
          Сегодня выполнено <strong>{{ progress.done }} из {{ progress.total }}</strong>.
        </template>
      </p>
    </div>
  </section>
</template>
