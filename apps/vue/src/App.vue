<script setup>
import { computed, ref, watchEffect } from 'vue';
import { STRIP_DAYS, applyTheme, lastNDays, nextTheme, toKey } from '@beads/core';
import { useHabits } from './composables/useHabits.js';
import { useToday } from './composables/useToday.js';
import TopBar from './components/TopBar.vue';
import TodayHeader from './components/TodayHeader.vue';
import DayAxis from './components/DayAxis.vue';
import HabitRow from './components/HabitRow.vue';
import EmptyState from './components/EmptyState.vue';
import StatsPanel from './components/StatsPanel.vue';
import HabitDialog from './components/HabitDialog.vue';
import AppFooter from './components/AppFooter.vue';
import PlusIcon from './components/PlusIcon.vue';

const { state, saveFailed, addHabit, updateHabit, deleteHabit, toggle, setTheme, replaceState } = useHabits();
const today = useToday();
const todayKey = computed(() => toKey(today.value));
const days = computed(() => lastNDays(STRIP_DAYS, today.value));

const selectedId = ref(null);
// null — диалог закрыт, 'new' — новая привычка, иначе id редактируемой
const dialog = ref(null);

watchEffect(() => applyTheme(state.value.theme));

const habits = computed(() => state.value.habits);
const selected = computed(
  () => habits.value.find((h) => h.id === selectedId.value) ?? habits.value[0] ?? null,
);
const editing = computed(() =>
  dialog.value && dialog.value !== 'new' ? habits.value.find((h) => h.id === dialog.value) : null,
);

function onSave(data) {
  if (editing.value) updateHabit(editing.value.id, data);
  else selectedId.value = addHabit(data).id;
}

function onDelete() {
  if (editing.value) deleteHabit(editing.value.id);
}

function quickAdd(example) {
  selectedId.value = addHabit(example).id;
}
</script>

<template>
  <div class="app">
    <TopBar :theme="state.theme" @theme-change="setTheme(nextTheme(state.theme))" />

    <TodayHeader :today="today" :habits="habits" />

    <div class="layout">
      <main>
        <EmptyState v-if="habits.length === 0" @create="dialog = 'new'" @quick-add="quickAdd" />
        <template v-else>
          <div class="list-head">
            <h2 class="list-head__title">Привычки</h2>
            <DayAxis :days="days" :today-key="todayKey" />
          </div>
          <ul class="habits">
            <HabitRow
              v-for="habit in habits"
              :key="habit.id"
              :habit="habit"
              :days="days"
              :today="today"
              :today-key="todayKey"
              :selected="selected?.id === habit.id"
              @select="selectedId = habit.id"
              @toggle="toggle(habit.id, $event)"
              @edit="dialog = habit.id"
            />
          </ul>
          <p style="margin-top: 20px">
            <button type="button" class="btn btn--primary" @click="dialog = 'new'">
              <PlusIcon /> Добавить привычку
            </button>
          </p>
        </template>
      </main>

      <StatsPanel :habit="selected" :today="today" />
    </div>

    <AppFooter :state="state" :save-failed="saveFailed" @import="replaceState" />

    <HabitDialog
      v-if="dialog"
      :key="dialog"
      :habit="editing"
      @save="onSave"
      @delete="onDelete"
      @close="dialog = null"
    />
  </div>
</template>
