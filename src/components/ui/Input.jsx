import "./Input.css";

export default function Input({
  id,
  label,
  type = "text",
  hint,
  error,
  className = "",
  inputClassName = "",
  ...rest
}) {
  return (
    <div className={`ui-field ${className}`.trim()}>
      {label ? (
        <label className="ui-field__label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        className={`ui-field__input ${error ? "ui-field__input--error" : ""} ${inputClassName}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...rest}
      />
      {hint && !error ? (
        <p className="ui-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="ui-field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
