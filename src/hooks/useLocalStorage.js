import { useState, useEffect, useCallback, useRef } from "react";

function readStorage(key, initialValue) {
  if (typeof window === "undefined") return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    if (item === null || item === "undefined") return initialValue;
    return JSON.parse(item);
  } catch {
    return initialValue;
  }
}

export function useLocalStorage(key, initialValue) {
  // ✅ Keep a stable ref to initialValue so it never triggers re-renders
  const initialValueRef = useRef(initialValue);

  const [stored, setStored] = useState(() =>
    readStorage(key, initialValueRef.current)
  );

  // ✅ Only re-run when `key` changes, NOT when initialValue changes
  // (initialValue is often a literal [] or {} — new reference every render)
  useEffect(() => {
    setStored(readStorage(key, initialValueRef.current));
  }, [key]); // ← removed initialValue from here — this was the infinite loop bug

  const setValue = useCallback(
    (value) => {
      setStored((prev) => {
        const next =
          typeof value === "function"
            ? value(prev === undefined ? initialValueRef.current : prev)
            : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* quota or private mode */
        }
        return next;
      });
    },
    [key] // ✅ removed initialValue from here too
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setStored(initialValueRef.current); // ✅ use ref, not the raw prop
  }, [key]); // ✅ removed initialValue from here too

  return [stored, setValue, removeValue];
}