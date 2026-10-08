import { useId } from 'react';

interface BaseProps {
  label: string;
  error?: string | null;
}

type TextFieldProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, error, ...input }: TextFieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={error ? true : undefined} {...input} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

type SelectFieldProps = BaseProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[] };

export function SelectField({ label, options, error, ...select }: SelectFieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} {...select}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
