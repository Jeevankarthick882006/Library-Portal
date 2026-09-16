// src/hooks/useDebounce.js - Custom Hook for Debounced Search
import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a fast-changing value (such as user keystrokes in a search box).
 * It waits for the user to pause typing for `delay` milliseconds before updating the debounced value.
 * This prevents firing excessive API requests on every single keypress.
 *
 * @param {*} value - The input value to debounce
 * @param {number} delay - Delay time in milliseconds (default: 400ms)
 * @returns {*} debouncedValue
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: cancel timer if value changes before delay expires (e.g. user continues typing)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
