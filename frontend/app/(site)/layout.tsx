import { Footer } from "@/components/organisms/Footer";
import { Nav } from "@/components/organisms/Nav";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
