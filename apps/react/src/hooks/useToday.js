import { useEffect, useState } from 'react';
import { addDays, startOfDay, toKey } from '@beads/core';

/** Текущий день, который сам обновляется в полночь и при возвращении на вкладку. */
export function useToday() {
  const [today, setToday] = useState(() => startOfDay());

  useEffect(() => {
    const refresh = () => {
      const now = startOfDay();
      setToday((prev) => (toKey(prev) === toKey(now) ? prev : now));
    };
    const msToMidnight = addDays(today, 1).getTime() - Date.now() + 1000;
    const timer = setTimeout(refresh, Math.max(msToMidnight, 1000));
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [today]);

  return today;
}
