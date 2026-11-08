import Image from "next/image";
import { Badge } from "../atoms/Badge";
import type { Tone } from "@/lib/tone";
import landing from "@/styles/landing.module.css";

interface FlowPanelProps {
  no: number;
  who: string;
  tone: string;
  img: string;
  text: string;
  badge: string;
  badgeTone: Tone;
}

/** Satu panel di demo horizontal. `img` berisi folder ("alur/x") berarti SVG, ditampilkan utuh di latar warna panel. */
export function FlowPanel({ no, who, tone, img, text, badge, badgeTone }: FlowPanelProps) {
  return (
    <article className={landing.flowPanel} style={{ "--tone": tone } as React.CSSProperties}>
      <header className={landing.flowHead}>
        <span className={landing.flowWho}>{who}</span>
        <span className={landing.flowWho}>{String(no).padStart(2, "0")}</span>
      </header>
      <div className={`${landing.flowMedia} ${img.includes("/") ? landing.flowMediaDoodle : ""}`}>
        <Image
          src={`/illustrations/${img}.${img.includes("/") ? "svg" : "webp"}`}
          alt=""
          fill
          sizes="(max-width: 992px) 100vw, 40vw"
          className={landing.flowImg}
          data-flow-img
        />
      </div>
      <div className={landing.flowBody}>
        <p>{text}</p>
        <Badge tone={badgeTone}>{badge}</Badge>
      </div>
    </article>
  );
}
