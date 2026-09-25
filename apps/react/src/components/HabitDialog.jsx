import { useEffect, useRef, useState } from 'react';
import { COLORS, EMOJIS, NAME_MAX_LENGTH } from '@beads/core';

export default function HabitDialog({ habit, onSave, onDelete, onClose }) {
  const dialogRef = useRef(null);
  const [name, setName] = useState(habit?.name ?? '');
  const [emoji, setEmoji] = useState(habit?.emoji ?? EMOJIS[0]);
  const [color, setColor] = useState(habit?.color ?? COLORS[0].id);
  const [error, setError] = useState('');
  const isEdit = Boolean(habit);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Введите название привычки.');
      return;
    }
    onSave({ name: name.trim(), emoji, color });
    onClose();
  }

  function handleDelete() {
    if (window.confirm(`Удалить «${habit.name}» вместе со всеми отметками? Это нельзя отменить.`)) {
      onDelete();
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="habit-dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <h2 id="habit-dialog-title" className="form__title">
          {isEdit ? 'Изменить привычку' : 'Новая привычка'}
        </h2>

        <div className="field">
          <label className="field__label" htmlFor="habit-name">
            Название
          </label>
          <input
            id="habit-name"
            className="input"
            value={name}
            maxLength={NAME_MAX_LENGTH}
            placeholder="Например, зарядка утром"
            autoComplete="off"
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'habit-name-error' : undefined}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
          />
          {error && (
            <p id="habit-name-error" className="field__error">
              {error}
            </p>
          )}
        </div>

        <fieldset className="field">
          <legend className="field__label">Значок</legend>
          <div className="choices">
            {EMOJIS.map((e) => (
              <label key={e} className="choice">
                <input type="radio" name="emoji" value={e} checked={emoji === e} onChange={() => setEmoji(e)} />
                <span className="choice__face">{e}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend className="field__label">Цвет бусин</legend>
          <div className="choices">
            {COLORS.map((c) => (
              <label key={c.id} className="choice" title={c.label}>
                <input
                  type="radio"
                  name="color"
                  value={c.id}
                  checked={color === c.id}
                  onChange={() => setColor(c.id)}
                  aria-label={c.label}
                />
                <span className="choice__face choice__face--color" style={{ '--c': c.value }} />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form__actions">
          {isEdit && (
            <button type="button" className="btn btn--danger" onClick={handleDelete}>
              Удалить
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn btn--quiet" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn--primary">
            {isEdit ? 'Сохранить' : 'Добавить привычку'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
