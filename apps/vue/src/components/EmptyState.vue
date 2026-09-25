<script setup>
import PlusIcon from './PlusIcon.vue';

defineEmits(['create', 'quick-add']);

const examples = [
  { name: 'Пить воду', emoji: '💧', color: 'cobalt' },
  { name: 'Читать 20 минут', emoji: '📚', color: 'plum' },
  { name: 'Прогулка', emoji: '🌿', color: 'moss' },
];
</script>

<template>
  <div class="empty">
    <div class="empty__thread" aria-hidden="true">
      <span v-for="i in 7" :key="i" />
    </div>
    <h2>Нитка пока пустая</h2>
    <p>
      Добавьте привычку и отмечайте каждый день, когда её выполнили. Дни подряд соединятся цветной нитью —
      так видно, сколько вы держитесь.
    </p>
    <div class="empty__examples">
      <button type="button" class="btn btn--primary" @click="$emit('create')">
        <PlusIcon /> Добавить привычку
      </button>
      <button v-for="ex in examples" :key="ex.name" type="button" class="btn" @click="$emit('quick-add', ex)">
        {{ ex.emoji }} {{ ex.name }}
      </button>
    </div>
  </div>
</template>
