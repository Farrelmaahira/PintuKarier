import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Pintu Karier",
    template: "%s | Pintu Karier",
  },
  description:
    "Platform AI Berbasis Bukti yang Menghubungkan Seleksi Kerja, Jalur Belajar Mahasiswa, dan Pemutakhiran Kurikulum Vokasi. Politeknik Negeri Jakarta.",
};

export const viewport: Viewport = {
  themeColor: "#f7f7f7",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a href="#content" className="skip-link">
          Langsung ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
