'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize with initialValue to prevent SSR mismatch
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Only access localStorage after component mounts (client-side)
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(key);
        setValue(saved ? JSON.parse(saved) : initialValue);
      } catch (error) {
        console.warn(`localStorage error for key "${key}":`, error);
      }
    }
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // initialValue intentionally omitted to prevent infinite loops

  useEffect(() => {
    // Only save to localStorage after hydration and on client-side
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to save to localStorage for key "${key}":`, error);
      }
    }
  }, [key, value, isHydrated]);

  return [value, setValue] as const;
}