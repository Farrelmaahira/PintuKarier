const PTS = [
  [0, 2], [0.8, 2], [1.6, 2], [2.4, 2], [3.2, 2], [4, 2],
  [3.2, 1.2], [2.4, 0.4], [3.2, 2.8], [2.4, 3.6],
];

/** Panah dot-matrix untuk kartu loader. */
export function DottedArrow() {
  return (
    <svg width="28" height="28" viewBox="-0.6 -0.6 5.2 5.2" aria-hidden>
      {PTS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.32" fill="currentColor" />
      ))}
    </svg>
  );
}
