import { createPortal } from "react-dom";
import { useToast } from "../../context/ToastContext.jsx";
import Toast from "./Toast.jsx";
import "./ToastContainer.css";

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="toast-stack" aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={dismissToast} />
      ))}
    </div>,
    document.body
  );
}
