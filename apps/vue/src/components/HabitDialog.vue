<script setup>
import { onMounted, ref } from 'vue';
import { COLORS, EMOJIS, NAME_MAX_LENGTH } from '@beads/core';

const props = defineProps({
  habit: { type: Object, default: null },
});
const emit = defineEmits(['save', 'delete', 'close']);

const dialogRef = ref(null);
const nameRef = ref(null);
const name = ref(props.habit?.name ?? '');
const emoji = ref(props.habit?.emoji ?? EMOJIS[0]);
const color = ref(props.habit?.color ?? COLORS[0].id);
const error = ref('');
const isEdit = Boolean(props.habit);

onMounted(() => {
  if (!dialogRef.value.open) dialogRef.value.showModal();
  nameRef.value?.focus();
});

function submit() {
  if (!name.value.trim()) {
    error.value = 'Введите название привычки.';
    return;
  }
  emit('save', { name: name.value.trim(), emoji: emoji.value, color: color.value });
  emit('close');
}

function remove() {
  if (window.confirm(`Удалить «${props.habit.name}» вместе со всеми отметками? Это нельзя отменить.`)) {
    emit('delete');
    emit('close');
  }
}

function onBackdrop(event) {
  if (event.target === dialogRef.value) emit('close');
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="dialog"
    aria-labelledby="habit-dialog-title"
    @close="emit('close')"
    @click="onBackdrop"
  >
    <form class="form" novalidate @submit.prevent="submit">
      <h2 id="habit-dialog-title" class="form__title">
        {{ isEdit ? 'Изменить привычку' : 'Новая привычка' }}
      </h2>

      <div class="field">
        <label class="field__label" for="habit-name">Название</label>
        <input
          id="habit-name"
          ref="nameRef"
          v-model="name"
          class="input"
          :maxlength="NAME_MAX_LENGTH"
          placeholder="Например, зарядка утром"
          autocomplete="off"
          :aria-invalid="Boolean(error)"
          :aria-describedby="error ? 'habit-name-error' : undefined"
          @input="error = ''"
        />
        <p v-if="error" id="habit-name-error" class="field__error">{{ error }}</p>
      </div>

      <fieldset class="field">
        <legend class="field__label">Значок</legend>
        <div class="choices">
          <label v-for="e in EMOJIS" :key="e" class="choice">
            <input v-model="emoji" type="radio" name="emoji" :value="e" />
            <span class="choice__face">{{ e }}</span>
          </label>
        </div>
      </fieldset>

      <fieldset class="field">
        <legend class="field__label">Цвет бусин</legend>
        <div class="choices">
          <label v-for="c in COLORS" :key="c.id" class="choice" :title="c.label">
            <input v-model="color" type="radio" name="color" :value="c.id" :aria-label="c.label" />
            <span class="choice__face choice__face--color" :style="{ '--c': c.value }" />
          </label>
        </div>
      </fieldset>

      <div class="form__actions">
        <button v-if="isEdit" type="button" class="btn btn--danger" @click="remove">Удалить</button>
        <span class="spacer" />
        <button type="button" class="btn btn--quiet" @click="emit('close')">Отмена</button>
        <button type="submit" class="btn btn--primary">
          {{ isEdit ? 'Сохранить' : 'Добавить привычку' }}
        </button>
      </div>
    </form>
  </dialog>
</template>
