import { ScrollTrigger } from "../gsap";
import type { Cleanup } from "./select";

/** Trigger positions depend on final font metrics and image sizes. */
export function refreshOnLoad(): Cleanup {
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener("load", refresh);
  return () => window.removeEventListener("load", refresh);
}
