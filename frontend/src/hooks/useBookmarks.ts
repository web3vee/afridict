import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'afridict_bookmarks';

function loadFromStorage(): Record<number, any> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(data: Record<number, any>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// Module-level state so all components share the same bookmark store
// without needing a Context provider
let _store: Record<number, any> = loadFromStorage();
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach(fn => fn());
}

export function useBookmarks() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const tick = () => rerender(n => n + 1);
    _listeners.add(tick);
    return () => { _listeners.delete(tick); };
  }, []);

  const isBookmarked = useCallback((id: number) => id in _store, []);

  const toggleBookmark = useCallback((market: any) => {
    const id = market.contractId ?? market.id;
    if (id in _store) {
      delete _store[id];
    } else {
      _store[id] = market;
    }
    saveToStorage(_store);
    notify();
  }, []);

  const bookmarks: any[] = Object.values(_store);

  return { isBookmarked, toggleBookmark, bookmarks };
}
