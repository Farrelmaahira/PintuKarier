// Domain berlabel huruf/angka/strip dan TLD minimal 2 huruf, jadi `gmail.c0m` atau `gmail.c` ditolak.
const EMAIL_FORMAT = /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

// Domain mirip penyedia ini (gma4il.com) hampir pasti salah ketik, dan banyak yang sudah dimiliki pihak lain
// sehingga email Pintu Karier bisa nyasar ke mereka.
const POPULAR_PROVIDERS = ["gmail.com", "yahoo.com", "yahoo.co.id", "outlook.com", "hotmail.com", "icloud.com"];
// Domain asli yang kebetulan mirip penyedia di atas.
// shortcut: daftar tangan, satu-satunya cara pasti adalah link verifikasi email; tambah itu sebelum pilot.
const REAL_DOMAINS = new Set(["mail.com", "email.com", "ymail.com", "cloud.com", "yahoo.ca", "yahoo.co.in", "yahoo.co.uk", "yahoo.co.jp", "hotmail.ca"]);

/** Pesan kesalahan email, atau "" bila lolos. */
export function validateEmail(email: string): string {
  if (!EMAIL_FORMAT.test(email)) return "Format email belum bener.";
  const at = email.lastIndexOf("@");
  const domain = email.slice(at + 1).toLowerCase();
  if (POPULAR_PROVIDERS.includes(domain) || REAL_DOMAINS.has(domain)) return "";
  const lookalike = POPULAR_PROVIDERS.find((provider) => editDistance(domain, provider) <= 2);
  return lookalike ? `Domain email kayaknya salah ketik. Maksudnya ${email.slice(0, at)}@${lookalike}?` : "";
}

/** Jarak edit Damerau (OSA): tukar dua huruf bersebelahan dihitung satu, jadi `gmial` berjarak 1 dari `gmail`. */
function editDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}
