import Image from "next/image";
import auth from "@/styles/auth.module.css";

interface AuthArtProps {
  img: string;
  tone: string;
  tag: string;
  title: string;
  description: string;
}

/** Panel ilustrasi di halaman login/daftar: kertas grafik, doodle berwarna peran, judul dan isi. */
export function AuthArt({ img, tone, tag, title, description }: AuthArtProps) {
  return (
    <div className={`${auth.art} graph-paper`} style={{ "--tone": tone } as React.CSSProperties}>
      <div className={auth.artCard}>
        <span className={auth.artTag}>{tag}</span>
        <div className={auth.artMedia}>
          <Image key={img} src={`/illustrations/doodles/${img}.svg`} alt="" width={1024} height={768} className={auth.artImg} priority />
        </div>
        <div className={auth.artBody}>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
      </div>
      <p className={auth.credit}>Ilustrasi: Open Doodles oleh Pablo Stanley (CC0), diwarnai ulang.</p>
    </div>
  );
}
