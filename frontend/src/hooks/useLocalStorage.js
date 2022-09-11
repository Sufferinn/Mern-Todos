import { useEffect, useState } from 'react';

export const useLocalStorage = (key, initialValue = null) => {
  const [storedValue, setStoredValue] = useState(() => {
    const jsonVal = localStorage.getItem(key);
    if (jsonVal) return JSON.parse(jsonVal);

    return initialValue;
  });

  const setValue = (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    setStoredValue(newValue)
  }

  useEffect(() => {
     localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setValue]
};
