import Image from "next/image";
import landing from "@/styles/landing.module.css";

interface HeroPieceImageProps {
  name: string;
  priority?: boolean;
}

/** Gambar isometrik satu potongan ilustrasi hero (dekoratif). */
export function HeroPieceImage({ name, priority }: HeroPieceImageProps) {
  return <Image src={`/illustrations/${name}.webp`} alt="" width={640} height={640} priority={priority} className={landing.pieceImg} />;
}
