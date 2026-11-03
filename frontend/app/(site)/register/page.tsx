import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { RegisterPanel } from "@/components/organisms/RegisterPanel";

export const metadata: Metadata = { title: "Daftar" };

export default function RegisterPage() {
  return (
    <main id="content">
      {/* RegisterPanel membaca ?peran= dari URL. */}
      <Suspense fallback={<Skeleton height="720px" />}>
        <RegisterPanel />
      </Suspense>
    </main>
  );
}
