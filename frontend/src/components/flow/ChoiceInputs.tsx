import type { OptionValue, QuestionOption } from '../../types/api';
import { EhsArt } from './EhsArt';

interface PickProps {
  options: QuestionOption[];
  current: OptionValue | undefined;
  disabled?: boolean;
  onPick: (value: OptionValue) => void;
}

function OptionButton({
  label,
  pressed,
  disabled,
  onClick,
}: {
  label: string;
  pressed: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="opt"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="mark" />
      <span>{label}</span>
    </button>
  );
}

export function SingleChoice({ options, current, disabled, onPick }: PickProps) {
  return (
    <div className="opts">
      {options.map((o) => (
        <OptionButton
          key={String(o.value)}
          label={o.label}
          pressed={current === o.value}
          disabled={disabled}
          onClick={() => onPick(o.value)}
        />
      ))}
    </div>
  );
}

/** Four illustrated grades, plus "not sure" as a plain option underneath. */
export function EhsChoice({ options, current, disabled, onPick }: PickProps) {
  const grades = options.filter((o) => typeof o.value === 'number');
  const unsure = options.filter((o) => typeof o.value !== 'number');
  return (
    <>
      <div className="ehs">
        {grades.map((o) => (
          <button
            type="button"
            key={String(o.value)}
            aria-pressed={current === o.value}
            disabled={disabled}
            onClick={() => onPick(o.value)}
          >
            <span className="lab">Grado {o.value}</span>
            <EhsArt grade={Number(o.value)} />
            <span className="txt">{o.label}</span>
          </button>
        ))}
      </div>
      {unsure.length > 0 && (
        <div className="opts" style={{ marginTop: 10 }}>
          {unsure.map((o) => (
            <OptionButton
              key={String(o.value)}
              label={o.label}
              pressed={current === o.value}
              disabled={disabled}
              onClick={() => onPick(o.value)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function ScaleChoice({
  labels,
  current,
  disabled,
  onPick,
}: {
  labels: string[];
  current: OptionValue | undefined;
  disabled?: boolean;
  onPick: (value: number) => void;
}) {
  return (
    <div className="scale">
      {labels.map((label, i) => (
        <button
          type="button"
          key={label}
          aria-pressed={current === i + 1}
          disabled={disabled}
          onClick={() => onPick(i + 1)}
        >
          <b>{i + 1}</b>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

interface MultiProps {
  options: QuestionOption[];
  value: string[];
  disabled?: boolean;
  onChange: (value: string[]) => void;
}

/** Checklist where "exclusive" options (None / Don't know) clear the rest. */
export function MultiChoice({ options, value, disabled, onChange }: MultiProps) {
  const toggle = (option: QuestionOption) => {
    const key = String(option.value);
    if (option.exclusive) {
      onChange(value.includes(key) ? [] : [key]);
      return;
    }
    const exclusive = new Set(options.filter((o) => o.exclusive).map((o) => String(o.value)));
    const rest = value.filter((v) => !exclusive.has(v));
    onChange(rest.includes(key) ? rest.filter((v) => v !== key) : [...rest, key]);
  };
  return (
    <div className="opts">
      {options.map((o) => (
        <OptionButton
          key={String(o.value)}
          label={o.label}
          pressed={value.includes(String(o.value))}
          disabled={disabled}
          onClick={() => toggle(o)}
        />
      ))}
    </div>
  );
}
