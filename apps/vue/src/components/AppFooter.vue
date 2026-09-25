<script setup>
import { ref } from 'vue';
import { downloadState, importState, plural } from '@beads/core';

const props = defineProps({
  state: { type: Object, required: true },
  saveFailed: { type: Boolean, default: false },
});
const emit = defineEmits(['import']);

const fileRef = ref(null);
const status = ref({ text: '', error: false });
const word = (n) => plural(n, ['привычка', 'привычки', 'привычек']);

async function onFile(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  try {
    const next = importState(await file.text());
    const n = next.habits.length;
    if (!window.confirm(`В файле ${n} ${word(n)}. Заменить ими текущие данные?`)) return;
    emit('import', next);
    status.value = { text: `Загружено: ${n} ${word(n)}.`, error: false };
  } catch (err) {
    status.value = { text: err.message, error: true };
  }
}

function onExport() {
  downloadState(props.state);
  status.value = { text: 'Резервная копия скачана.', error: false };
}
</script>

<template>
  <footer class="footer">
    <p>
      {{
        saveFailed
          ? 'Браузер не даёт сохранять данные — отметки пропадут после закрытия вкладки.'
          : 'Данные хранятся только в этом браузере.'
      }}
    </p>
    <div class="footer__actions">
      <button type="button" class="btn" :disabled="state.habits.length === 0" @click="onExport">
        Скачать копию
      </button>
      <button type="button" class="btn" @click="fileRef?.click()">Загрузить из файла</button>
      <input ref="fileRef" type="file" accept="application/json,.json" hidden @change="onFile" />
    </div>
    <p class="footer__status" :class="{ 'is-error': status.error }" role="status">{{ status.text }}</p>
  </footer>
</template>
