import Image from "next/image";
import type { ReactNode } from "react";
import { Ribbon } from "../atoms/Ribbon";
import landing from "@/styles/landing.module.css";

interface PrizeCardProps {
  label: string;
  highlight: string;
  img: string;
  children: ReactNode;
}

/**
 * Kartu gaya prize: media hangat dengan pita dan ilustrasi bergoyang, lalu isi.
 * `img` berisi folder ("doodles/x", "rencana/x") berarti SVG; doodle 4:3 dapat ruang lebih lebar.
 * Tanpa folder berarti ilustrasi isometrik .webp.
 */
export function PrizeCard({ label, highlight, img, children }: PrizeCardProps) {
  const svg = img.includes("/");
  const doodle = img.startsWith("doodles/");
  return (
    <div className={landing.prize} data-reveal-item>
      <div className={landing.prizeMedia}>
        <Ribbon text={label} highlight={highlight} />
        <span className={`${landing.prizeArt} ${doodle ? landing.prizeArtDoodle : ""}`} data-wiggle="4">
          <Image src={`/illustrations/${img}.${svg ? "svg" : "webp"}`} alt="" width={doodle ? 1024 : 320} height={doodle ? 768 : 320} />
        </span>
      </div>
      {children}
    </div>
  );
}
