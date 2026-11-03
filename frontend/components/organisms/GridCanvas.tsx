"use client";

import { useRef } from "react";
import { setupGsap, useGSAP } from "@/lib/gsap";
import { createGridCanvas } from "@/lib/motion/gridCanvas";
import landing from "@/styles/landing.module.css";

setupGsap();

/** Latar kertas grafik interaktif; sel yang disentuh kursor menyala lalu pudar. */
export function GridCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => createGridCanvas(ref.current!), { scope: ref });
  return <div ref={ref} className={landing.gridCanvas} aria-hidden />;
}
