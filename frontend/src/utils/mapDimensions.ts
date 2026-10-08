import type { ReportMap } from '../types/api';

/** The seven radar axes, in drawing order. */
export const MAP_DIMENSIONS: { key: keyof ReportMap; label: string }[] = [
  { key: 'mechanism', label: 'Mecanismo' },
  { key: 'function', label: 'Función' },
  { key: 'desire', label: 'Deseo' },
  { key: 'ejaculation', label: 'Eyaculación' },
  { key: 'body', label: 'Cuerpo' },
  { key: 'mind', label: 'Cabeza' },
  { key: 'habits', label: 'Hábitos' },
];
