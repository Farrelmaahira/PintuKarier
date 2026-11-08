const PTS = [
  [0, 0], [1, 1], [2, 2], [3, 3], [4, 4],
  [4, 0], [3, 1], [1, 3], [0, 4],
];

/** Ikon X dot-matrix dari bahasa visual Overflow Grid. */
export function DottedX() {
  return (
    <svg width="30" height="30" viewBox="-1 -1 6 6" aria-hidden>
      {PTS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.42" fill="currentColor" />
      ))}
    </svg>
  );
}
