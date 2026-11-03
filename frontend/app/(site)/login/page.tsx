import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { LoginPanel } from "@/components/organisms/LoginPanel";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <main id="content">
      <Suspense fallback={<Skeleton height="640px" />}>
        <LoginPanel />
      </Suspense>
    </main>
  );
}
