import type { ReactNode } from "react";
import ui from "@/styles/ui.module.css";

interface KeyValueProps {
  items: [string, ReactNode][];
}

export function KeyValue({ items }: KeyValueProps) {
  return (
    <dl className={ui.kv}>
      {items.map(([k, v]) => (
        <div key={k} style={{ display: "contents" }}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
