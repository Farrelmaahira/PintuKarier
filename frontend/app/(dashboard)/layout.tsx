import { Suspense } from "react";
import { SessionSidebar } from "@/components/organisms/SessionSidebar";
import dashboard from "@/styles/dashboard.module.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={dashboard.shell}>
      <Suspense fallback={<aside className={dashboard.sidebar} aria-hidden />}>
        <SessionSidebar />
      </Suspense>
      <div className={dashboard.content}>{children}</div>
    </div>
  );
}
