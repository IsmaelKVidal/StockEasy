import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, ...rest }: InputProps) {
  const inputId = id ?? `input-${label}`;
  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} {...rest} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
