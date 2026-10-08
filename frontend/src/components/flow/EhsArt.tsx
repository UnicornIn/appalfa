const CURVES: Record<number, string> = {
  1: 'M20 74 C 34 72, 46 68, 58 64',
  2: 'M20 74 C 34 70, 48 58, 58 44',
  3: 'M20 74 C 36 66, 50 44, 56 22',
  4: 'M20 74 C 38 62, 50 34, 52 8',
};

/** Abstract drawing of each firmness grade. */
export function EhsArt({ grade }: { grade: number }) {
  return (
    <svg
      viewBox="0 0 80 84"
      width="100%"
      height={76}
      fill="none"
      aria-hidden="true"
      style={{ maxWidth: 80 }}
    >
      <path d="M14 78h52" stroke="#3c3d3f" strokeWidth={1} />
      <path d={CURVES[grade] ?? CURVES[1]} stroke="#c5c6c8" strokeWidth={3} strokeLinecap="round" />
      <circle cx={20} cy={74} r={2.5} fill="#8a8b8d" />
    </svg>
  );
}
