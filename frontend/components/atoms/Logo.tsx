interface LogoProps {
  size?: number;
}

/** Tanda Pintu Karier: lembar CV dengan centang, kotak biru di pojok. */
export function Logo({ size = 32 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M14 14H34L42 22V44H14Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M34 14V22H42"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M20 30L25 35L35 25"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="40"
        y="40"
        width="16"
        height="16"
        fill="#4da2ff"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
}
