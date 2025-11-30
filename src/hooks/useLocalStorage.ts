/**
 * Hook for managing localStorage with React state
 */

import { useState, useEffect, useCallback } from "react";

/**
 * Options for useLocalStorage hook
 */
export interface UseLocalStorageOptions<T> {
  /**
   * Default value if key doesn't exist
   */
  defaultValue?: T;
  /**
   * Serializer function (default: JSON.stringify)
   */
  serialize?: (value: T) => string;
  /**
   * Deserializer function (default: JSON.parse)
   */
  deserialize?: (value: string) => T;
}

/**
 * Hook to sync state with localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { serialize = JSON.stringify, deserialize = JSON.parse } = options;

  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return deserialize(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, serialize(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue]
  );

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(deserialize(e.newValue));
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, deserialize]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for boolean localStorage values
 */
export function useLocalStorageBoolean(
  key: string,
  initialValue: boolean = false
): [
  boolean,
  (value: boolean | ((prev: boolean) => boolean)) => void,
  () => void
] {
  return useLocalStorage(key, initialValue, {
    serialize: (value) => (value ? "1" : "0"),
    deserialize: (value) => value === "1",
  });
}

/**
 * Hook for string localStorage values
 */
export function useLocalStorageString(
  key: string,
  initialValue: string = ""
): [string, (value: string | ((prev: string) => string)) => void, () => void] {
  return useLocalStorage(key, initialValue, {
    serialize: (value) => value,
    deserialize: (value) => value,
  });
}
