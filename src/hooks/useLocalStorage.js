import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // 1. Initialize state with value from localStorage, or fallback to initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key "' + key + '":', error);
      return initialValue;
    }
  });

  // 2. Define a setter function that updates both React state AND localStorage
  const setValue = value => {
    try {
      // Allow value to be a function, just like standard useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage key "' + key + '":', error);
    }
  };

  // 3. Optional: Sync across browser tabs (If user opens app in 2 tabs, updates in one, the other updates too)
  useEffect(() => {
    const handleStorageChange = e => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
