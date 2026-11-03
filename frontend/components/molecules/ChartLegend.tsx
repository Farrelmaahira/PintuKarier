import ui from "@/styles/ui.module.css";

interface ChartLegendProps {
  series: { name: string; tone: string }[];
}

/** Legenda grafik: kotak warna dan nama tiap seri. */
export function ChartLegend({ series }: ChartLegendProps) {
  return (
    <ul className={ui.legend} data-fade>
      {series.map((item) => (
        <li key={item.name}>
          <span className={ui.swatch} style={{ background: item.tone }} aria-hidden />
          {item.name}
        </li>
      ))}
    </ul>
  );
}
