/** Runs `cb` when the loader fires `event`, or right away when no intro is playing. */
export function onIntro(event: string, cb: () => void): () => void {
  if (document.documentElement.dataset.intro !== "play") {
    cb();
    return () => undefined;
  }
  const handler = () => cb();
  window.addEventListener(event, handler, { once: true });
  return () => window.removeEventListener(event, handler);
}
