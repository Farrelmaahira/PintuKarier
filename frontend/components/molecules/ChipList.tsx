import type { CSSProperties } from "react";
import app from "@/styles/app.module.css";

interface ChipListProps {
  items: string[];
  style?: CSSProperties;
}

export function ChipList({ items, style }: ChipListProps) {
  return (
    <div className={app.chips} style={style}>
      {items.map((item) => (
        <span key={item} className={app.chip}>
          {item}
        </span>
      ))}
    </div>
  );
}
