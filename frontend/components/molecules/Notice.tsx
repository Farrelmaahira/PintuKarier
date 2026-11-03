import { CheckCircle, CircleNotch, Info, WarningOctagon } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import ui from "@/styles/ui.module.css";

const ICON = {
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  error: <WarningOctagon size={20} />,
  pending: <CircleNotch size={20} className={ui.spin} />,
};

interface NoticeProps {
  tone?: keyof typeof ICON;
  children: ReactNode;
}

export function Notice({ tone = "info", children }: NoticeProps) {
  return (
    <div className={`${ui.notice} ${ui[`notice-${tone}`]}`} role={tone === "error" ? "alert" : "status"}>
      {ICON[tone]}
      <div>{children}</div>
    </div>
  );
}
