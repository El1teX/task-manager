import { useEffect, useMemo, useState } from 'react';
import { STRIP_DAYS, applyTheme, lastNDays, nextTheme, toKey } from '@beads/core';
import { useHabits } from './hooks/useHabits.js';
import { useToday } from './hooks/useToday.js';
import TopBar from './components/TopBar.jsx';
import TodayHeader from './components/TodayHeader.jsx';
import DayAxis from './components/DayAxis.jsx';
import HabitRow from './components/HabitRow.jsx';
import EmptyState from './components/EmptyState.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import HabitDialog from './components/HabitDialog.jsx';
import Footer from './components/Footer.jsx';
import { PlusIcon } from './components/Icons.jsx';

export default function App() {
  const { state, saveFailed, addHabit, updateHabit, deleteHabit, toggle, setTheme, replaceState } = useHabits();
  const today = useToday();
  const todayKey = toKey(today);
  const days = useMemo(() => lastNDays(STRIP_DAYS, today), [today]);

  const [selectedId, setSelectedId] = useState(null);
  // null — диалог закрыт, 'new' — новая привычка, иначе id редактируемой
  const [dialog, setDialog] = useState(null);

  useEffect(() => applyTheme(state.theme), [state.theme]);

  const { habits } = state;
  const selected = habits.find((h) => h.id === selectedId) ?? habits[0] ?? null;
  const editing = dialog && dialog !== 'new' ? habits.find((h) => h.id === dialog) : null;

  function handleSave(data) {
    if (editing) updateHabit(editing.id, data);
    else setSelectedId(addHabit(data).id);
  }

  return (
    <div className="app">
      <TopBar theme={state.theme} onThemeChange={() => setTheme(nextTheme(state.theme))} />

      <TodayHeader today={today} habits={habits} />

      <div className="layout">
        <main>
          {habits.length === 0 ? (
            <EmptyState
              onCreate={() => setDialog('new')}
              onQuickAdd={(example) => setSelectedId(addHabit(example).id)}
            />
          ) : (
            <>
              <div className="list-head">
                <h2 className="list-head__title">Привычки</h2>
                <DayAxis days={days} todayKey={todayKey} />
              </div>
              <ul className="habits">
                {habits.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    days={days}
                    today={today}
                    todayKey={todayKey}
                    selected={selected?.id === habit.id}
                    onSelect={() => setSelectedId(habit.id)}
                    onToggle={(key) => toggle(habit.id, key)}
                    onEdit={() => setDialog(habit.id)}
                  />
                ))}
              </ul>
              <p style={{ marginTop: 20 }}>
                <button type="button" className="btn btn--primary" onClick={() => setDialog('new')}>
                  <PlusIcon /> Добавить привычку
                </button>
              </p>
            </>
          )}
        </main>

        <StatsPanel habit={selected} today={today} />
      </div>

      <Footer state={state} saveFailed={saveFailed} onImport={replaceState} />

      {dialog && (
        <HabitDialog
          key={dialog}
          habit={editing}
          onSave={handleSave}
          onDelete={() => editing && deleteHabit(editing.id)}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
