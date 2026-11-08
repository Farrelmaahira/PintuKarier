import { gsap, ScrollTrigger } from "../gsap";
import { prefersReducedMotion } from "../reducedMotion";
import { buildCells, drawCells, GRID_COLORS } from "./gridCells";
import type { Cleanup } from "./select";

/** Interactive graph paper: hovered cells light up and fade (overflow "events" grid). */
export function createGridCanvas(host: HTMLElement): Cleanup {
  const canvas = document.createElement("canvas");
  host.appendChild(canvas);
  const context = canvas.getContext("2d")!;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  let grid = buildCells(0, 0);
  let lastIndex = -1;

  const draw = () => drawCells(context, canvas, grid.cells, grid.size);
  const layout = () => {
    const width = host.offsetWidth;
    const height = host.offsetHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    grid = buildCells(width, height);
  };
  layout();
  draw();

  // Only redraw while the section is on screen.
  let active = false;
  const scrollTrigger = ScrollTrigger.create({
    trigger: host,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => {
      if (self.isActive && !active) gsap.ticker.add(draw);
      if (!self.isActive && active) gsap.ticker.remove(draw);
      active = self.isActive;
    },
  });

  const hoverable = !prefersReducedMotion() && window.matchMedia("(hover: hover)").matches;
  const lightUp = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const column = Math.floor((event.clientX - rect.left) / grid.size);
    const row = Math.floor((event.clientY - rect.top) / grid.size);
    const index = row * grid.columns + column;
    const cell = grid.cells[index];
    if (!cell || index === lastIndex) return;
    lastIndex = index;
    cell.color = GRID_COLORS[Math.floor(Math.random() * GRID_COLORS.length)]!;
    gsap.killTweensOf(cell);
    gsap.to(cell, { alpha: 1, duration: 0.1 });
    gsap.to(cell, { alpha: 0, duration: 2, delay: 0.5, ease: "power1.out" });
  };
  const resize = () => {
    layout();
    draw();
  };
  if (hoverable) host.parentElement?.addEventListener("pointermove", lightUp);
  window.addEventListener("resize", resize);

  return () => {
    scrollTrigger.kill();
    gsap.ticker.remove(draw);
    host.parentElement?.removeEventListener("pointermove", lightUp);
    window.removeEventListener("resize", resize);
    canvas.remove();
  };
}
