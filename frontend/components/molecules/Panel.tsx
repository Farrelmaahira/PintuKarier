import type { ReactNode } from "react";
import { Tag } from "../atoms/Tag";
import ui from "@/styles/ui.module.css";

interface PanelProps {
  title?: ReactNode;
  tag?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  flush?: boolean;
  id?: string;
}

/** Kotak konten berbingkai 2px dengan judul dan aksi opsional. */
export function Panel({
  title,
  tag,
  actions,
  children,
  flush,
  id,
}: PanelProps) {
  return (
    <section className={ui.panelWrap} id={id}>
      {tag && (typeof tag === "string" ? <Tag>{tag}</Tag> : tag)}
      <div className={ui.panel}>
        {(title || actions) && (
          <header className={ui.panelHead}>
            {title && <h2 className={ui.panelTitle}>{title}</h2>}
            {actions}
          </header>
        )}
        <div className={`${ui.panelBody} ${flush ? ui.flush : ""}`}>
          {children}
        </div>
      </div>
    </section>
  );
}
