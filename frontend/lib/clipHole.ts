/** Polygon with an even-odd hole; the hole grows to reveal the page underneath. */
export function clipHole(w: number, h: number, hw: number, hh: number) {
  const l0 = (w - hw) / 2;
  const t0 = (h - hh) / 2;
  const r0 = l0 + hw;
  const b0 = t0 + hh;
  return `polygon(evenodd, 0px 0px, ${w}px 0px, ${w}px ${h}px, 0px ${h}px, 0px 0px, ${l0}px ${t0}px, ${r0}px ${t0}px, ${r0}px ${b0}px, ${l0}px ${b0}px, ${l0}px ${t0}px)`;
}
