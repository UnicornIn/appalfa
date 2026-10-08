import { useState } from 'react';
import type { BodyMetrics } from '../../types/api';
import { TextField } from '../ui/Fields';

const WEIGHT_RANGE = [20, 400] as const;
const HEIGHT_RANGE = [100, 230] as const;

const inRange = (n: number, [min, max]: readonly [number, number]) => n >= min && n <= max;

interface NumberProps {
  label: string;
  min: number;
  max: number;
  initial: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function NumberInput({ label, min, max, initial, onChange }: NumberProps) {
  const [raw, setRaw] = useState(initial === undefined ? '' : String(initial));
  const parsed = raw.trim() === '' ? NaN : Number(raw);
  const valid = Number.isInteger(parsed) && parsed >= min && parsed <= max;
  return (
    <div style={{ maxWidth: 220, marginTop: 22 }}>
      <TextField
        label={label}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={raw}
        error={raw !== '' && !valid ? `Escribe un número entre ${min} y ${max}.` : null}
        onChange={(e) => {
          setRaw(e.target.value);
          const n = e.target.value.trim() === '' ? NaN : Number(e.target.value);
          onChange(Number.isInteger(n) && n >= min && n <= max ? n : undefined);
        }}
      />
    </div>
  );
}

interface BodyProps {
  initial: BodyMetrics | undefined;
  onChange: (value: BodyMetrics | undefined) => void;
}

export function BodyMetricsInput({ initial, onChange }: BodyProps) {
  const [weight, setWeight] = useState(initial ? String(initial.weight_kg) : '');
  const [height, setHeight] = useState(initial ? String(initial.height_cm) : '');

  const update = (w: string, h: string) => {
    const weightKg = Number(w);
    const heightCm = Number(h);
    const ok =
      w !== '' && h !== '' && inRange(weightKg, WEIGHT_RANGE) && inRange(heightCm, HEIGHT_RANGE);
    onChange(ok ? { weight_kg: weightKg, height_cm: heightCm } : undefined);
  };
  const weightBad = weight !== '' && !inRange(Number(weight), WEIGHT_RANGE);
  const heightBad = height !== '' && !inRange(Number(height), HEIGHT_RANGE);

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 22 }}>
      <div style={{ width: 160 }}>
        <TextField
          label="Peso (kg)"
          type="number"
          inputMode="decimal"
          value={weight}
          error={weightBad ? 'Revisa el peso.' : null}
          onChange={(e) => {
            setWeight(e.target.value);
            update(e.target.value, height);
          }}
        />
      </div>
      <div style={{ width: 160 }}>
        <TextField
          label="Estatura (cm)"
          type="number"
          inputMode="numeric"
          value={height}
          error={heightBad ? 'Revisa la estatura.' : null}
          onChange={(e) => {
            setHeight(e.target.value);
            update(weight, e.target.value);
          }}
        />
      </div>
    </div>
  );
}

interface TextProps {
  initial: string;
  onChange: (value: string) => void;
}

export function TextAnswerInput({ initial, onChange }: TextProps) {
  const [text, setText] = useState(initial);
  return (
    <div className="field" style={{ marginTop: 22 }}>
      <label htmlFor="text-answer">En una línea</label>
      <textarea
        id="text-answer"
        rows={3}
        maxLength={500}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
