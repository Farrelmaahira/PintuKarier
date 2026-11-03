import ui from "@/styles/ui.module.css";

interface SkeletonProps {
  width?: string;
  height?: string;
}

export function Skeleton({ width = "100%", height = "1em" }: SkeletonProps) {
  return <span className={ui.skeleton} style={{ width, height }} aria-hidden />;
}
