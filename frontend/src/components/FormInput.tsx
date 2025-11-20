import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export default function FormInput({ label, hint, error, id, name, ...rest }: Props) {
  const _id = id || name || crypto.randomUUID();
  const describedBy = [
    hint && !error ? `${_id}-hint` : '',
    error ? `${_id}-error` : '',
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className="mb-4">
      <label htmlFor={_id} className="label">{label}</label>
      <input
        id={_id}
        name={name}
        className={`input ${error ? 'error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint && !error && <p id={`${_id}-hint`} className="helper mt-1">{hint}</p>}
      {error && <p id={`${_id}-error`} className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
