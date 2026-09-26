import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const removeToast = useCallback((id) => {
    const t = timers.current.get(id);
    if (t) window.clearTimeout(t);
    timers.current.delete(id);
    setToasts((list) => list.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ title, message, variant = "info", duration = 4200 }) => {
      const id = ++toastId;
      const toast = {
        id,
        title,
        message,
        variant,
        duration,
      };
      setToasts((list) => [...list, toast]);
      const timer = window.setTimeout(() => removeToast(id), duration);
      timers.current.set(id, timer);
      return id;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      toast: pushToast,
      dismissToast: removeToast,
    }),
    [toasts, pushToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
