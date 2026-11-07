import Image from "next/image";
import type { ReactNode } from "react";
import ui from "@/styles/ui.module.css";
import app from "@/styles/app.module.css";

interface EmptyStateProps {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  img?: string;
  large?: boolean;
}

export function EmptyState({
  title,
  children,
  action,
  img = "undraw/empty",
  large = false,
}: EmptyStateProps) {
  const imageSrc = img.startsWith("undraw/") || img.startsWith("doodles/")
    ? `/illustrations/${img}.svg`
    : `/illustrations/${img}.webp`;

  return (
    <div className={`${ui.empty} ${app.emptyArt} ${large ? app.emptyArtLarge : ""}`}>
      <div style={{ maxWidth: large ? 260 : 120, maxHeight: large ? 195 : 120, width: "100%", display: "flex", justifyContent: "flex-start", overflow: "hidden" }}>
        <Image
          src={imageSrc}
          alt=""
          width={large ? 260 : 120}
          height={large ? 195 : 120}
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </div>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
