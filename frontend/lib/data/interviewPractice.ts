export interface PracticeCategory {
  id: string;
  name: string;
  description: string;
}

export interface PracticeQuestionItem {
  id: string;
  categoryId: string;
  categoryName: string;
  kind: string;
  text: string;
}

export interface PracticeProfileContext {
  name?: string;
  studyProgram?: string;
  semester?: number;
  campus?: string;
}

export const PRACTICE_CATEGORIES: PracticeCategory[] = [
  {
    id: "profile",
    name: "Sesuai Program Studi Saya",
    description: "Pertanyaan diracik personal berdasarkan program studi dan status semester akademik kamu.",
  },
  {
    id: "bisnis",
    name: "Bisnis, Manajemen & Pemasaran",
    description: "Fokus pada riset pasar, negosiasi, pencapaian target kerja, dan manajemen pemangku kepentingan.",
  },
  {
    id: "keuangan",
    name: "Keuangan, Akuntansi & Administrasi",
    description: "Fokus pada ketelitian data, pelaporan keuangan, audit dokumen, dan kepatuhan prosedur.",
  },
  {
    id: "kreatif",
    name: "Desain, Komunikasi & Media Kreatif",
    description: "Fokus pada eksplorasi ide, komunikasi visual, pengelolaan brief, dan penyelarasan umpan balik.",
  },
  {
    id: "teknik",
    name: "Teknik, Manufaktur & Operasional",
    description: "Fokus pada standar keselamatan kerja (K3), pemeliharaan peralatan, dan rekayasa proses lapangan.",
  },
  {
    id: "it",
    name: "Teknologi Informasi & Rekayasa Perangkat Lunak",
    description: "Fokus pada logika sistem, kolaborasi kode, investigasi bug, dan arsitektur aplikasi.",
  },
  {
    id: "umum",
    name: "Umum & Sikap Kerja (Metode STAR)",
    description: "Fokus pada kepemimpinan, penyelesaian konflik, etika kerja, dan adaptabilitas lingkungan baru.",
  },
];

export const PRACTICE_QUESTION_BANK: PracticeQuestionItem[] = [
  // Bisnis, Manajemen & Pemasaran
  {
    id: "bisnis-tek-1",
    categoryId: "bisnis",
    categoryName: "Bisnis, Manajemen & Pemasaran",
    kind: "teknis",
    text: "Bagaimana tahapan kamu dalam menyusun analisis pasar sebelum meluncurkan produk atau kampanye baru?",
  },
  {
    id: "bisnis-tek-2",
    categoryId: "bisnis",
    categoryName: "Bisnis, Manajemen & Pemasaran",
    kind: "teknis",
    text: "Metrik apa saja yang paling kamu perhatikan saat mengevaluasi efektivitas saluran pemasaran digital?",
  },
  {
    id: "bisnis-tek-3",
    categoryId: "bisnis",
    categoryName: "Bisnis, Manajemen & Pemasaran",
    kind: "teknis",
    text: "Bagaimana pendekatanmu dalam menentukan segmentasi audiens sasaran agar komunikasi pemasaran tepat sasaran?",
  },
  {
    id: "bisnis-star-1",
    categoryId: "bisnis",
    categoryName: "Bisnis, Manajemen & Pemasaran",
    kind: "star",
    text: "Ceritakan pengalaman saat kamu harus meyakinkan calon klien atau mitra bisnis yang awalnya ragu. Apa tindakanmu?",
  },
  {
    id: "bisnis-star-2",
    categoryId: "bisnis",
    categoryName: "Bisnis, Manajemen & Pemasaran",
    kind: "star",
    text: "Ceritakan sebuah kampanye promosi atau proyek bisnis yang pernah kamu kelola dari awal hingga selesai dan apa dampaknya.",
  },
  {
    id: "bisnis-star-3",
    categoryId: "bisnis",
    categoryName: "Bisnis, Manajemen & Pemasaran",
    kind: "star",
    text: "Pernahkah kamu menghadapi target performa kerja yang sangat menantang dalam waktu singkat? Bagaimana caramu mencapainya?",
  },
  {
    id: "bisnis-sit-1",
    categoryId: "bisnis",
    categoryName: "Bisnis, Manajemen & Pemasaran",
    kind: "situasional",
    text: "Jika target penjualan atau metrik kampanye menurun drastis di pertengahan periode, tindakan perbaikan apa yang pertama kamu ambil?",
  },
  {
    id: "bisnis-sit-2",
    categoryId: "bisnis",
    categoryName: "Bisnis, Manajemen & Pemasaran",
    kind: "situasional",
    text: "Bagaimana caramu menangani keluhan klien penting yang merasa tidak puas dengan hasil kerja tim kamu?",
  },
  {
    id: "bisnis-sit-3",
    categoryId: "bisnis",
    categoryName: "Bisnis, Manajemen & Pemasaran",
    kind: "situasional",
    text: "Jika kompetitor meluncurkan penawaran serupa dengan harga jauh lebih murah, bagaimana strategimu mempertahankan keunggulan?",
  },

  // Keuangan, Akuntansi & Administrasi
  {
    id: "keuangan-tek-1",
    categoryId: "keuangan",
    categoryName: "Keuangan, Akuntansi & Administrasi",
    kind: "teknis",
    text: "Bagaimana prosedur kamu dalam memastikan akurasi rekonsiliasi data dan mencegah selisih pencatatan laporan keuangan?",
  },
  {
    id: "keuangan-tek-2",
    categoryId: "keuangan",
    categoryName: "Keuangan, Akuntansi & Administrasi",
    kind: "teknis",
    text: "Langkah apa yang kamu lakukan untuk mengaudit kelayakan dokumen transaksi sebelum disetujui untuk pembayaran?",
  },
  {
    id: "keuangan-tek-3",
    categoryId: "keuangan",
    categoryName: "Keuangan, Akuntansi & Administrasi",
    kind: "teknis",
    text: "Bagaimana caramu mengelola arsip dan database administrasi agar mudah ditelusuri kembali saat ada audit mendadak?",
  },
  {
    id: "keuangan-star-1",
    categoryId: "keuangan",
    categoryName: "Keuangan, Akuntansi & Administrasi",
    kind: "star",
    text: "Ceritakan pengalaman saat kamu menemukan selisih atau kesalahan data penting dalam laporan administrasi. Bagaimana cara kamu mengatasinya?",
  },
  {
    id: "keuangan-star-2",
    categoryId: "keuangan",
    categoryName: "Keuangan, Akuntansi & Administrasi",
    kind: "star",
    text: "Ceritakan saat kamu harus menyelesaikan laporan tutup buku atau rekapitulasi data dengan tenggat waktu yang sangat ketat.",
  },
  {
    id: "keuangan-star-3",
    categoryId: "keuangan",
    categoryName: "Keuangan, Akuntansi & Administrasi",
    kind: "star",
    text: "Pernahkah kamu menyederhanakan alur kerja administrasi manual menjadi lebih efisien? Apa perubahan yang kamu buat?",
  },
  {
    id: "keuangan-sit-1",
    categoryId: "keuangan",
    categoryName: "Keuangan, Akuntansi & Administrasi",
    kind: "situasional",
    text: "Jika ada divisi lain meminta pengeluaran anggaran mendesak tanpa kelengkapan dokumen pendukung yang sah, sikap apa yang kamu ambil?",
  },
  {
    id: "keuangan-sit-2",
    categoryId: "keuangan",
    categoryName: "Keuangan, Akuntansi & Administrasi",
    kind: "situasional",
    text: "Bagaimana sikapmu jika atasan meminta kamu merevisi laporan dengan angka yang tidak sesuai dengan bukti fisik transaksi?",
  },
  {
    id: "keuangan-sit-3",
    categoryId: "keuangan",
    categoryName: "Keuangan, Akuntansi & Administrasi",
    kind: "situasional",
    text: "Jika sistem pencatatan digital mengalami kegagalan teknis di akhir periode pembukuan, langkah darurat apa yang kamu siapkan?",
  },

  // Desain, Komunikasi & Media Kreatif
  {
    id: "kreatif-tek-1",
    categoryId: "kreatif",
    categoryName: "Desain, Komunikasi & Media Kreatif",
    kind: "teknis",
    text: "Jelaskan alur proses kreatif kamu mulai dari mencerna brief, eksplorasi konsep, hingga finalisasi aset visual.",
  },
  {
    id: "kreatif-tek-2",
    categoryId: "kreatif",
    categoryName: "Desain, Komunikasi & Media Kreatif",
    kind: "teknis",
    text: "Bagaimana caramu menjaga konsistensi identitas merek (brand guideline) di berbagai platform media yang berbeda?",
  },
  {
    id: "kreatif-tek-3",
    categoryId: "kreatif",
    categoryName: "Desain, Komunikasi & Media Kreatif",
    kind: "teknis",
    text: "Apa pertimbangan utamamu dalam memilih tipografi, hierarki visual, dan palet warna untuk sebuah materi komunikasi?",
  },
  {
    id: "kreatif-star-1",
    categoryId: "kreatif",
    categoryName: "Desain, Komunikasi & Media Kreatif",
    kind: "star",
    text: "Ceritakan pengalaman saat karya desain atau tulisan yang kamu buat mendapat kritik tajam dari pemangku kepentingan. Apa responsmu?",
  },
  {
    id: "kreatif-star-2",
    categoryId: "kreatif",
    categoryName: "Desain, Komunikasi & Media Kreatif",
    kind: "star",
    text: "Ceritakan karya atau kampanye visual yang paling kamu banggakan. Pesan apa yang ingin disampaikan dan bagaimana hasilnya?",
  },
  {
    id: "kreatif-star-3",
    categoryId: "kreatif",
    categoryName: "Desain, Komunikasi & Media Kreatif",
    kind: "star",
    text: "Pernahkah kamu mengalami kebuntuan ide (creative block) saat tenggat waktu sudah sangat dekat? Bagaimana kamu mengatasinya?",
  },
  {
    id: "kreatif-sit-1",
    categoryId: "kreatif",
    categoryName: "Desain, Komunikasi & Media Kreatif",
    kind: "situasional",
    text: "Bagaimana kamu menyeimbangkan antara estetika ideal menurutmu dengan batasan kebutuhan bisnis atau permintaan klien yang berbeda?",
  },
  {
    id: "kreatif-sit-2",
    categoryId: "kreatif",
    categoryName: "Desain, Komunikasi & Media Kreatif",
    kind: "situasional",
    text: "Jika klien meminta perubahan desain besar-besaran beberapa jam sebelum materi harus naik cetak atau tayang, apa langkahmu?",
  },

  // Teknik, Manufaktur & Operasional
  {
    id: "teknik-tek-1",
    categoryId: "teknik",
    categoryName: "Teknik, Manufaktur & Operasional",
    kind: "teknis",
    text: "Bagaimana caramu menerapkan prinsip keselamatan dan kesehatan kerja (K3) serta standar operasional dalam pekerjaan lapangan?",
  },
  {
    id: "teknik-tek-2",
    categoryId: "teknik",
    categoryName: "Teknik, Manufaktur & Operasional",
    kind: "teknis",
    text: "Metode apa yang kamu gunakan untuk mengontrol kualitas hasil produksi agar cacat produk dapat ditekan seminimal mungkin?",
  },
  {
    id: "teknik-tek-3",
    categoryId: "teknik",
    categoryName: "Teknik, Manufaktur & Operasional",
    kind: "teknis",
    text: "Bagaimana pendekatanmu dalam melakukan perawatan preventif pada mesin atau instrumen kerja lapangan?",
  },
  {
    id: "teknik-star-1",
    categoryId: "teknik",
    categoryName: "Teknik, Manufaktur & Operasional",
    kind: "star",
    text: "Ceritakan saat kamu menghadapi kendala teknis atau kegagalan sistem operasional yang menghambat alur kerja. Tindakan apa yang kamu ambil?",
  },
  {
    id: "teknik-star-2",
    categoryId: "teknik",
    categoryName: "Teknik, Manufaktur & Operasional",
    kind: "star",
    text: "Ceritakan pengalaman memimpin atau berpartisipasi dalam proyek instalasi, pengujian mesin, atau penataan tata letak kerja.",
  },
  {
    id: "teknik-sit-1",
    categoryId: "teknik",
    categoryName: "Teknik, Manufaktur & Operasional",
    kind: "situasional",
    text: "Jika proses operasional mengalami keterlambatan material dari pemasok, strategi mitigasi apa yang kamu usulkan agar target tidak meleset?",
  },
  {
    id: "teknik-sit-2",
    categoryId: "teknik",
    categoryName: "Teknik, Manufaktur & Operasional",
    kind: "situasional",
    text: "Bagaimana tindakanmu jika melihat rekan kerja mengabaikan prosedur K3 demi mengejar kecepatan kerja?",
  },

  // Teknologi Informasi & Rekayasa Perangkat Lunak
  {
    id: "it-tek-1",
    categoryId: "it",
    categoryName: "Teknologi Informasi & Rekayasa Perangkat Lunak",
    kind: "teknis",
    text: "Ceritakan satu proyek pengembangan perangkat lunak yang paling kamu banggakan. Arsitektur apa yang kamu terapkan dan apa peranmu?",
  },
  {
    id: "it-tek-2",
    categoryId: "it",
    categoryName: "Teknologi Informasi & Rekayasa Perangkat Lunak",
    kind: "teknis",
    text: "Bagaimana metodemu dalam mengoptimalkan performa aplikasi dan memastikan kode yang kamu tulis mudah dirawat tim lain?",
  },
  {
    id: "it-tek-3",
    categoryId: "it",
    categoryName: "Teknologi Informasi & Rekayasa Perangkat Lunak",
    kind: "teknis",
    text: "Bagaimana pendekatan kamu dalam merancang antarmuka REST API atau pengelolaan state agar aplikasi tetap responsif?",
  },
  {
    id: "it-star-1",
    categoryId: "it",
    categoryName: "Teknologi Informasi & Rekayasa Perangkat Lunak",
    kind: "star",
    text: "Pernahkah kamu menemukan bug kritis atau kendala integrasi yang sulit diidentifikasi? Bagaimana tahapan kamu dalam membereskannya?",
  },
  {
    id: "it-star-2",
    categoryId: "it",
    categoryName: "Teknologi Informasi & Rekayasa Perangkat Lunak",
    kind: "star",
    text: "Ceritakan saat kamu harus mempelajari framework atau teknologi baru dalam waktu singkat untuk menyelesaikan sebuah modul aplikasi.",
  },
  {
    id: "it-star-3",
    categoryId: "it",
    categoryName: "Teknologi Informasi & Rekayasa Perangkat Lunak",
    kind: "star",
    text: "Ceritakan pengalamanmu saat berkolaborasi menggunakan Git dalam tim pengembang di mana terjadi konflik kode yang kompleks.",
  },
  {
    id: "it-sit-1",
    categoryId: "it",
    categoryName: "Teknologi Informasi & Rekayasa Perangkat Lunak",
    kind: "situasional",
    text: "Ketika tim produk memberikan spesifikasi yang sulit diimplementasikan secara teknis dalam tenggat waktu yang ada, solusi apa yang kamu tawarkan?",
  },
  {
    id: "it-sit-2",
    categoryId: "it",
    categoryName: "Teknologi Informasi & Rekayasa Perangkat Lunak",
    kind: "situasional",
    text: "Jika server produksi mengalami down mendadak saat jam kerja sibuk, langkah investigasi awal apa yang segera kamu jalankan?",
  },

  // Umum & Sikap Kerja (STAR Method)
  {
    id: "umum-tek-1",
    categoryId: "umum",
    categoryName: "Umum & Sikap Kerja",
    kind: "teknis",
    text: "Bagaimana caramu mengatur prioritas kerja harian ketika menghadapi beberapa tugas mendesak dari atasan yang berbeda?",
  },
  {
    id: "umum-tek-2",
    categoryId: "umum",
    categoryName: "Umum & Sikap Kerja",
    kind: "teknis",
    text: "Metode komunikasi seperti apa yang menurutmu paling efektif saat menyampaikan laporan perkembangan tugas kepada tim?",
  },
  {
    id: "umum-star-1",
    categoryId: "umum",
    categoryName: "Umum & Sikap Kerja",
    kind: "star",
    text: "Ceritakan pengalaman saat kamu harus berkolaborasi dengan rekan kerja yang memiliki gaya komunikasi bertolak belakang denganmu.",
  },
  {
    id: "umum-star-2",
    categoryId: "umum",
    categoryName: "Umum & Sikap Kerja",
    kind: "star",
    text: "Ceritakan saat kamu harus mempelajari keterampilan, perangkat kerja, atau prosedur baru dalam waktu singkat demi menyelesaikan tugas.",
  },
  {
    id: "umum-star-3",
    categoryId: "umum",
    categoryName: "Umum & Sikap Kerja",
    kind: "star",
    text: "Pernahkah kamu mengambil inisiatif mandiri untuk menyelesaikan sebuah permasalahan tanpa harus menunggu arahan atasan?",
  },
  {
    id: "umum-sit-1",
    categoryId: "umum",
    categoryName: "Umum & Sikap Kerja",
    kind: "situasional",
    text: "Jika kamu menyadari telah membuat kesalahan dalam pekerjaan yang belum diketahui oleh rekan kerja atau atasan, apa yang akan kamu lakukan?",
  },
  {
    id: "umum-sit-2",
    categoryId: "umum",
    categoryName: "Umum & Sikap Kerja",
    kind: "situasional",
    text: "Bagaimana sikapmu jika atasan memberikan tugas di luar tanggung jawab utamamu saat kamu sedang fokus pada target penting?",
  },
];

/** Bank soal khusus personal berbasis program studi dan konteks mahasiswa. */
function getPersonalizedQuestionBank(profile?: PracticeProfileContext): PracticeQuestionItem[] {
  const prodi = profile?.studyProgram?.trim() || "Program Studi kamu";
  const studentName = profile?.name?.trim() || "kamu";

  return [
    {
      id: "prodi-tek-1",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "teknis",
      text: `Sebagai mahasiswa di ${prodi}, ceritakan satu proyek akademik atau tugas besar yang paling relevan dengan bidang keahlianmu. Apa peran penting yang kamu pegang di situ?`,
    },
    {
      id: "prodi-tek-2",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "teknis",
      text: `Di bidang ${prodi}, metode, perangkat, atau teknologi apa yang paling sering kamu gunakan dan menurutmu paling kamu kuasai?`,
    },
    {
      id: "prodi-tek-3",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "teknis",
      text: `Bagaimana caramu membuktikan bahwa kompetensi yang kamu dapatkan di ${prodi} siap diterapkan pada kebutuhan industri saat ini?`,
    },
    {
      id: "prodi-tek-4",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "teknis",
      text: `Ceritakan saat kamu harus menyelesaikan tugas akhir atau studi kasus yang menuntut pendalaman teknis di ${prodi}. Apa tantangan terbesarnya?`,
    },
    {
      id: "prodi-star-1",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "star",
      text: `Ceritakan pengalaman nyata saat ${studentName} harus bekerja sama dalam tim tugas atau organisasi kampus dan menemui perbedaan pendapat. Bagaimana cara kamu menyelesaikannya?`,
    },
    {
      id: "prodi-star-2",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "star",
      text: `Pernahkah kamu menghadapi situasi di mana hasil tugas perkuliahan atau magangmu dikritik oleh dosen pembimbing? Apa tindakan perbaikan yang kamu lakukan?`,
    },
    {
      id: "prodi-star-3",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "star",
      text: `Ceritakan saat ${studentName} harus membagi waktu antara jadwal kuliah padat, tugas proyek, dan kegiatan lain. Bagaimana caramu menjaga komitmen?`,
    },
    {
      id: "prodi-star-4",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "star",
      text: `Ceritakan momen saat kamu memimpin atau mengoordinasikan rekan-rekan sesama mahasiswa di ${prodi} untuk menyelesaikan penugasan bersama.`,
    },
    {
      id: "prodi-sit-1",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "situasional",
      text: `Jika di tempat kerja nanti kamu diberikan tanggung jawab di luar kurikulum perkuliahan yang pernah kamu pelajari di ${prodi}, langkah apa yang kamu ambil untuk mengejar ketertinggalan?`,
    },
    {
      id: "prodi-sit-2",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "situasional",
      text: `Bagaimana sikapmu jika di lingkungan kerja nanti atasan memberikan instruksi teknis yang bertolak belakang dengan teori yang kamu pelajari di kampus?`,
    },
    {
      id: "prodi-sit-3",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "situasional",
      text: `Kalau kamu ditempatkan dalam tim kerja lintas bidang yang latar belakang pendidikannya berbeda dari ${prodi}, bagaimana caramu menjalin kolaborasi yang efektif?`,
    },
    {
      id: "prodi-sit-4",
      categoryId: "profile",
      categoryName: "Sesuai Program Studi",
      kind: "situasional",
      text: `Saat tenggat waktu pengiriman tugas mendesak dan kamu merasa hasilnya belum sempurna, keputusan apa yang akan kamu ambil?`,
    },
  ];
}

/** Mengacak dan memilih 3 pertanyaan (1 Teknis, 1 STAR, 1 Situasional) dari bank soal yang kaya sesuai kategori. */
export function generatePracticeQuestions(
  categoryId: string,
  profile?: PracticeProfileContext,
): string[] {
  const isProfileMode = categoryId === "profile";
  const pool = isProfileMode ? getPersonalizedQuestionBank(profile) : PRACTICE_QUESTION_BANK.filter((item) => item.categoryId === categoryId);
  const activePool = pool.length >= 3 ? pool : PRACTICE_QUESTION_BANK;

  const teknisList = activePool.filter((q) => q.kind === "teknis");
  const starList = activePool.filter((q) => q.kind === "star");
  const situasionalList = activePool.filter((q) => q.kind === "situasional");

  const pickRandom = (arr: PracticeQuestionItem[], fallbackArr: PracticeQuestionItem[]): string => {
    const source = arr.length > 0 ? arr : fallbackArr;
    const randomIndex = Math.floor(Math.random() * source.length);
    return source[randomIndex]?.text || "Ceritakan proyek yang paling kamu banggakan dan peranmu di situ.";
  };

  const q1 = pickRandom(teknisList, activePool);
  let q2 = pickRandom(starList, activePool);
  let q3 = pickRandom(situasionalList, activePool);

  // Pastikan tidak ada soal duplikat
  if (q2 === q1 && activePool.length > 1) {
    const remaining = activePool.filter((q) => q.text !== q1);
    q2 = remaining[Math.floor(Math.random() * remaining.length)]?.text || q2;
  }
  if ((q3 === q1 || q3 === q2) && activePool.length > 2) {
    const remaining = activePool.filter((q) => q.text !== q1 && q.text !== q2);
    q3 = remaining[Math.floor(Math.random() * remaining.length)]?.text || q3;
  }

  return [q1, q2, q3];
}
