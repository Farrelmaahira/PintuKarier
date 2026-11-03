/** Naikkan ke angka "bulat" berikutnya: 1, 2, 5, atau 10 kali pangkat sepuluh (1200 jadi 2000). */
function niceCeil(value: number) {
  const power = 10 ** Math.floor(Math.log10(value));
  const mantissa = value / power;
  return (mantissa <= 1 ? 1 : mantissa <= 2 ? 2 : mantissa <= 5 ? 5 : 10) * power;
}

/**
 * Skala sumbu nilai grafik batang. `log` untuk nilai yang bedanya berlipat-lipat (mis. detik vs menit):
 * garis bantunya 1, 10, 100, ... dan posisi bar dihitung dari logaritma. Sumbu berhenti di angka bulat
 * terdekat di atas nilai terbesar, bukan di pangkat sepuluh berikutnya, supaya tidak ada seperempat plot yang kosong.
 */
export function createScale(values: number[], log: boolean) {
  const max = Math.max(1, ...values);
  const top = log ? Math.max(10, niceCeil(max)) : max;
  const position = (value: number) => (log ? Math.log10(Math.max(value, 1)) / Math.log10(top) : value / top) * 100;
  const decades = Array.from({ length: Math.floor(Math.log10(top)) + 1 }, (_, index) => 10 ** index);
  const ticks = log ? decades : [0, top / 2, top];
  return { position, ticks };
}

export const formatNumber = (value: number) => value.toLocaleString("id-ID");
