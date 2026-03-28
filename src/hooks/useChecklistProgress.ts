import { useCallback, useEffect, useState } from 'react';

const CHECKLIST_KEY = 'prototype-checklist-progress';

type ChecklistState = Record<string, Record<string, boolean>>;

function loadState(): ChecklistState {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state: ChecklistState) {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
}

export function useChecklistProgress(zoneId: string) {
  const [state, setState] = useState<ChecklistState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const isChecked = useCallback((itemIndex: number) => {
    return !!state[zoneId]?.[String(itemIndex)];
  }, [state, zoneId]);

  const toggle = useCallback((itemIndex: number) => {
    setState(prev => {
      const zoneState = { ...(prev[zoneId] || {}) };
      zoneState[String(itemIndex)] = !zoneState[String(itemIndex)];
      return { ...prev, [zoneId]: zoneState };
    });
  }, [zoneId]);

  const checkedCount = useCallback((total: number) => {
    if (!state[zoneId]) return 0;
    return Array.from({ length: total }, (_, i) => state[zoneId]?.[String(i)] || false)
      .filter(Boolean).length;
  }, [state, zoneId]);

  const resetZone = useCallback(() => {
    setState(prev => {
      const next = { ...prev };
      delete next[zoneId];
      return next;
    });
  }, [zoneId]);

  return { isChecked, toggle, checkedCount, resetZone };
}
