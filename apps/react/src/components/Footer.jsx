import { useRef, useState } from 'react';
import { downloadState, importState, plural } from '@beads/core';

export default function Footer({ state, saveFailed, onImport }) {
  const fileRef = useRef(null);
  const [status, setStatus] = useState({ text: '', error: false });

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const next = importState(await file.text());
      const n = next.habits.length;
      const ok = window.confirm(
        `В файле ${n} ${plural(n, ['привычка', 'привычки', 'привычек'])}. Заменить ими текущие данные?`,
      );
      if (!ok) return;
      onImport(next);
      setStatus({ text: `Загружено: ${n} ${plural(n, ['привычка', 'привычки', 'привычек'])}.`, error: false });
    } catch (err) {
      setStatus({ text: err.message, error: true });
    }
  }

  function handleExport() {
    downloadState(state);
    setStatus({ text: 'Резервная копия скачана.', error: false });
  }

  return (
    <footer className="footer">
      <p>
        {saveFailed
          ? 'Браузер не даёт сохранять данные — отметки пропадут после закрытия вкладки.'
          : 'Данные хранятся только в этом браузере.'}
      </p>
      <div className="footer__actions">
        <button type="button" className="btn" onClick={handleExport} disabled={state.habits.length === 0}>
          Скачать копию
        </button>
        <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
          Загрузить из файла
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={handleFile} />
      </div>
      <p className={`footer__status${status.error ? ' is-error' : ''}`} role="status">
        {status.text}
      </p>
    </footer>
  );
}
