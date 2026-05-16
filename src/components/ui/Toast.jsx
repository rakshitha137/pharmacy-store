import "./Toast.css";

export default function Toast({ toast, onDismiss }) {
  const { id, title, message, variant } = toast;

  return (
    <div className={`ui-toast ui-toast--${variant}`} role="status">
      <div className="ui-toast__body">
        <div className="ui-toast__title">{title}</div>
        {message ? <div className="ui-toast__message">{message}</div> : null}
      </div>
      <button
        type="button"
        className="ui-toast__close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
      >
        ×
      </button>
    </div>
  );
}
