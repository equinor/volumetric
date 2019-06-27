import React, { useState, useEffect } from 'react';
// https://www.robinwieruch.de/local-storage-react/

export const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = useState(
    localStorage.getItem(localStorageKey) || '',
  );

  useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value, localStorageKey]);

  return [value, setValue];
};
