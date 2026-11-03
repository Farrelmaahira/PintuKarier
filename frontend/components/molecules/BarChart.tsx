"use client";

import { useRef } from "react";
import { ChartLegend } from "./ChartLegend";
import { createScale, formatNumber } from "@/lib/chartScale";
import { useBarChartReveal } from "@/lib/hooks/useBarChartReveal";
import ui from "@/styles/ui.module.css";

export interface BarSeries {
  name: string;
  tone: string;
}
/** values urut sama dengan series; null = tidak ada nilai (mis. model gagal). */
export interface BarGroup {
  label: string;
  values: (number | null)[];
}

interface BarChartProps {
  title: string;
  series: BarSeries[];
  groups: BarGroup[];
  unit?: string;
  log?: boolean;
}

/**
 * Grafik batang horizontal berkelompok dengan sumbu nilai dan legenda.
 * Warna teks dan garis ikut currentColor, jadi menyatu dengan section terang maupun gelap.
 * Saat masuk layar, bar tumbuh dari kiri berurutan dan angkanya menghitung naik (GSAP).
 */
export function BarChart({ title, series, groups, unit = "", log = false }: BarChartProps) {
  const ref = useRef<HTMLElement>(null);
  const { position, ticks } = createScale(groups.flatMap((group) => group.values.map((value) => value ?? 0)), log);
  useBarChartReveal(ref, unit);

  return (
    <figure ref={ref} className={ui.chart}>
      <figcaption className={ui.chartTitle}>{title}</figcaption>
      <ChartLegend series={series} />
      <div className={ui.plot}>
        {ticks.map((tick) => (
          <span key={tick} className={ui.gridline} style={{ left: `${position(tick)}%` }} aria-hidden />
        ))}
        {groups.map((group) => (
          <div key={group.label} className={ui.group}>
            <span className={ui.groupLabel} data-fade>
              {group.label}
            </span>
            {series.map((item, index) => {
              const value = group.values[index] ?? null;
              const text = value === null ? "gagal" : `${formatNumber(value)}${unit}`;
              return (
                <div key={item.name} className={ui.barRow} role="img" aria-label={`${group.label}, ${item.name}: ${text}`} title={`${item.name}: ${text}`}>
                  <span className={ui.barFill} data-bar style={{ width: `${value === null ? 0 : position(value)}%`, background: item.tone }} />
                  <span className={ui.barValue} data-value={value ?? undefined}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className={ui.axis} aria-hidden>
        {ticks.map((tick) => (
          <span key={tick} style={{ left: `${position(tick)}%` }}>
            {formatNumber(tick)}
          </span>
        ))}
      </div>
    </figure>
  );
}
