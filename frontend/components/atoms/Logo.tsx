import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

/** Tanda resmi Pintu Karier: Pintu terbuka dengan panah biru ke atas dan aksen kotak. */
export function Logo({ size = 32, className }: LogoProps) {
  return (
    <Image
      src="/pintukarier.webp"
      alt="Pintu Karier"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "inline-block",
        verticalAlign: "middle",
      }}
      priority
    />
  );
}
