import { polar } from './geometry';

const CX = 120;
const CY = 118;
const R = 92;
const GAP = 3;

/** Four-segment firmness gauge: filled up to the grade the man chose himself. */
export function Gauge({ level }: { level: number | null }) {
  const segments = [0, 1, 2, 3].map((i) => {
    const [x0, y0] = polar(CX, CY, R, 180 + i * 45 + GAP);
    const [x1, y1] = polar(CX, CY, R, 180 + (i + 1) * 45 - GAP);
    const on = level !== null && i < level;
    return (
      <path
        key={i}
        d={`M${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`}
        stroke={on ? '#c5c6c8' : '#3c3d3f'}
        strokeWidth={13}
        fill="none"
        strokeLinecap="butt"
      />
    );
  });
  return (
    <svg
      viewBox="0 0 240 132"
      width={210}
      role="img"
      aria-label="Grado de firmeza que tú mismo seleccionaste"
    >
      {segments}
      <text
        x="120"
        y="112"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="40"
        fontWeight="900"
        fontFamily="Alexandria,sans-serif"
      >
        {level ?? '–'}
      </text>
      <text
        x="120"
        y="130"
        textAnchor="middle"
        fill="#8a8b8d"
        fontSize="10"
        letterSpacing="3"
        fontFamily="Alexandria,sans-serif"
      >
        DE 4
      </text>
    </svg>
  );
}
