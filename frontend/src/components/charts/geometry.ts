export function polar(cx: number, cy: number, r: number, degrees: number): [number, number] {
  const rad = (degrees * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}
