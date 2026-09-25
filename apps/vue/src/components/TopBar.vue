<script setup>
import { COLORS, THEME_LABELS } from '@beads/core';
import ThemeIcon from './ThemeIcon.vue';

defineProps({ theme: { type: String, required: true } });
defineEmits(['theme-change']);

const markColors = COLORS.slice(0, 3);
</script>

<template>
  <header class="topbar">
    <div class="brand">
      <span class="brand__mark" aria-hidden="true">
        <span v-for="c in markColors" :key="c.id" :style="{ '--c': c.value }" />
      </span>
      Beads
    </div>
    <button
      type="button"
      class="icon-btn"
      :aria-label="`${THEME_LABELS[theme]}. Переключить`"
      :title="THEME_LABELS[theme]"
      @click="$emit('theme-change')"
    >
      <ThemeIcon :theme="theme" />
    </button>
  </header>
</template>
