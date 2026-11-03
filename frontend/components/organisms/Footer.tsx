import Link from "next/link";
import { Logo } from "../atoms/Logo";
import shell from "@/styles/shell.module.css";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Produk",
    links: [
      ["Untuk Mahasiswa", "/register?peran=mahasiswa"],
      ["Untuk HRD Mitra", "/register?peran=hrd"],
      ["Untuk Program Studi", "/register?peran=prodi"],
    ],
  },
  {
    title: "Jelajahi",
    links: [
      ["Cara kerja", "/#cara-kerja"],
      ["Evidence Based Scoring", "/#skor"],
      ["FAQ", "/#faq"],
    ],
  },
  {
    title: "Akun",
    links: [
      ["Masuk", "/login"],
      ["Daftar", "/register"],
    ],
  },
];

/** Footer halaman publik: brand, navigasi per kolom, dan baris hak cipta. */
export function Footer() {
  return (
    <footer className={shell.footer}>
      <div className={shell.footerInner}>
        <div className={shell.footerAbout}>
          <Link href="/" className={shell.footerLogo}>
            <Logo size={36} />
            Pintu Karier
          </Link>
          <p>
            Platform rekrutmen kampus berbasis AI yang mengubah hasil seleksi kerja menjadi umpan balik kompetensi bagi
            mahasiswa, HRD mitra industri, dan program studi vokasi.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} className={shell.footerCol} aria-label={column.title}>
            <h3>{column.title}</h3>
            {column.links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className={shell.footerBottom}>
        <span>© 2026 Pintu Karier. Politeknik Negeri Jakarta, Depok.</span>
        <span>Data pada akun demo bersifat fiktif.</span>
      </div>
    </footer>
  );
}
