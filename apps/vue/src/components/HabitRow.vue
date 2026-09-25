<script setup>
import { computed } from 'vue';
import { colorValue, currentStreak, plural } from '@beads/core';
import BeadStrip from './BeadStrip.vue';
import EditIcon from './EditIcon.vue';

const props = defineProps({
  habit: { type: Object, required: true },
  days: { type: Array, required: true },
  today: { type: Date, required: true },
  todayKey: { type: String, required: true },
  selected: { type: Boolean, default: false },
});
defineEmits(['select', 'toggle', 'edit']);

const streakText = computed(() => {
  const n = currentStreak(props.habit, props.today);
  return n === 0 ? 'Серии пока нет' : `${n} ${plural(n, ['день', 'дня', 'дней'])} подряд`;
});
</script>

<template>
  <li class="habit" :class="{ 'is-selected': selected }" :style="{ '--c': colorValue(habit.color) }">
    <div class="habit__main">
      <span class="habit__emoji" aria-hidden="true">{{ habit.emoji }}</span>
      <div class="habit__text">
        <button
          type="button"
          class="habit__name"
          :aria-pressed="selected"
          title="Показать статистику"
          @click="$emit('select')"
        >
          {{ habit.name }}
        </button>
        <span class="habit__streak">{{ streakText }}</span>
      </div>
    </div>
    <div class="habit__side">
      <BeadStrip :habit="habit" :days="days" :today-key="todayKey" @toggle="$emit('toggle', $event)" />
      <button type="button" class="icon-btn" :aria-label="`Изменить «${habit.name}»`" @click="$emit('edit')">
        <EditIcon />
      </button>
    </div>
  </li>
</template>
