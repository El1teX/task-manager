<script setup>
import { formatWeekdayShort, toKey } from '@beads/core';

defineProps({
  days: { type: Array, required: true },
  todayKey: { type: String, required: true },
});
</script>

<template>
  <!-- Отступ справа — под кнопку «изменить» -->
  <div class="axis" aria-hidden="true" style="margin-right: 40px">
    <span v-for="day in days" :key="toKey(day)" :class="{ 'is-today': toKey(day) === todayKey }">
      <b>{{ formatWeekdayShort(day) }}</b>{{ day.getDate() }}
    </span>
  </div>
</template>
