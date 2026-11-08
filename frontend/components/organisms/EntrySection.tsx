import { SignIn, UserPlus } from "@phosphor-icons/react/dist/ssr";
import { HeroCta } from "../atoms/HeroCta";
import { GridCanvas } from "./GridCanvas";
import landing from "@/styles/landing.module.css";

/** Grid interaktif dengan dua CTA: masuk atau daftar. */
export function EntrySection() {
  return (
    <section className={landing.gridBand} data-theme-section="light">
      <GridCanvas />
      <div className={landing.gridBandInner}>
        <h2 className={landing.display} data-split="words">
          Pilih peranmu, langsung masuk.
        </h2>
        <p className={landing.gridBandSub}>Masuk pakai akun demo mahasiswa, HRD, atau prodi. Atau bikin akun baru, gratis.</p>
        <div className={landing.ctaRow}>
          <HeroCta href="/login" icon={<SignIn size={22} />}>
            Masuk
          </HeroCta>
          <HeroCta href="/register" icon={<UserPlus size={22} />}>
            Daftar
          </HeroCta>
        </div>
      </div>
    </section>
  );
}
