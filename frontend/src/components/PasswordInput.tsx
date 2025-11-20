import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export default function PasswordInput({ label, hint, error, id, name, ...rest }: Props) {
  const [show, setShow] = useState(false);
  const _id = id || name || crypto.randomUUID();
  const describedBy = [
    hint && !error ? `${_id}-hint` : '',
    error ? `${_id}-error` : '',
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className="mb-4">
      <label htmlFor={_id} className="label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          id={_id}
          name={name}
          type={show ? 'text' : 'password'}
          className={`input ${error ? 'error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="btn btn-ghost"
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          style={{ position: 'absolute', right: 6, top: 6, height: 'calc(100% - 12px)' }}
        >
          {show ? 'Ocultar' : 'Ver'}
        </button>
      </div>
      {hint && !error && <p id={`${_id}-hint`} className="helper mt-1">{hint}</p>}
      {error && <p id={`${_id}-error`} className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
