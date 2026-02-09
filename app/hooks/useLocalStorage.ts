import { useState, useEffect, useRef } from 'react';

function useLocalStorage<T>(key: string, defaultValue: T) {
  const isHydrated = useRef(false);

  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  // Read from localStorage (client only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);

      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }

      // mark hydration complete
      isHydrated.current = true;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      isHydrated.current = true;
    }
  }, [key]);

  // Write ONLY after hydration and only on user updates
  useEffect(() => {
    if (!isHydrated.current) return;
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

export default useLocalStorage;
