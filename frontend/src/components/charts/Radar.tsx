import type { ReportMap } from '../../types/api';
import { MAP_DIMENSIONS } from '../../utils/mapDimensions';
import { polar } from './geometry';

const CX = 230;
const CY = 200;
const RADIUS = 128;
const LEVELS = [0.25, 0.5, 0.75, 1];

const fmt = (point: [number, number]) => point.map((v) => v.toFixed(1)).join(',');
const angle = (i: number) => -90 + (i * 360) / MAP_DIMENSIONS.length;

/** Seven-axis map drawn from the report values: farther from the centre, better. */
export function Radar({ map }: { map: ReportMap }) {
  const ring = (f: number) =>
    MAP_DIMENSIONS.map((_, i) => fmt(polar(CX, CY, RADIUS * f, angle(i)))).join(' ');
  const shape = MAP_DIMENSIONS.map((d, i) =>
    fmt(polar(CX, CY, (RADIUS * map[d.key]) / 100, angle(i))),
  ).join(' ');

  return (
    <svg
      viewBox="0 0 460 400"
      width="100%"
      role="img"
      aria-label="Mapa de siete dimensiones construido con tus respuestas"
    >
      {LEVELS.map((f) => (
        <polygon
          key={f}
          points={ring(f)}
          fill="none"
          stroke="#c5c6c8"
          strokeWidth={1}
          opacity={f === 1 ? 0.3 : 0.12}
        />
      ))}
      {MAP_DIMENSIONS.map((d, i) => {
        const [x, y] = polar(CX, CY, RADIUS, angle(i));
        return (
          <line
            key={d.key}
            x1={CX}
            y1={CY}
            x2={x.toFixed(1)}
            y2={y.toFixed(1)}
            stroke="#c5c6c8"
            strokeWidth={1}
            opacity={0.12}
          />
        );
      })}
      <polygon
        points={shape}
        fill="#c5c6c8"
        fillOpacity={0.14}
        stroke="#c5c6c8"
        strokeWidth={1.6}
      />
      {MAP_DIMENSIONS.map((d, i) => {
        const [x, y] = polar(CX, CY, (RADIUS * map[d.key]) / 100, angle(i));
        return <circle key={d.key} cx={x.toFixed(1)} cy={y.toFixed(1)} r={3.2} fill="#c5c6c8" />;
      })}
      {MAP_DIMENSIONS.map((d, i) => {
        const [x, y] = polar(CX, CY, RADIUS + 26, angle(i));
        const anchor = x > CX + 12 ? 'start' : x < CX - 12 ? 'end' : 'middle';
        return (
          <g key={d.key} fontFamily="Alexandria,sans-serif" textAnchor={anchor}>
            <text
              x={x.toFixed(1)}
              y={y.toFixed(1)}
              fill="#c5c6c8"
              fontSize="11"
              letterSpacing="1.6"
            >
              {d.label.toUpperCase()}
            </text>
            <text x={x.toFixed(1)} y={(y + 15).toFixed(1)} fill="#8a8b8d" fontSize="10.5">
              {map[d.key]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
