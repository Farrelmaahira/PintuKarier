export interface DepartmentStudyProgram {
  name: string;
  degree: string;
  studentsCount: number;
  absorptionRate: number;
}

export interface DepartmentGapSolution {
  skill: string;
  description: string;
  mitraDemand: string;
  rpsRecommendation: string;
}

export interface DepartmentDetailData {
  code: string;
  name: string;
  description: string;
  totalStudents: number;
  totalApplicants: number;
  partnerCount: number;
  readinessScore: number;
  absorbedPercentage: number;
  averageWaitTimeMonths: number;
  studyPrograms: DepartmentStudyProgram[];
  competencyGaps: DepartmentGapSolution[];
  recruitingPartners: string[];
}

export const DEPARTMENT_DETAILS: Record<string, DepartmentDetailData> = {
  TIK: {
    code: "TIK",
    name: "Teknik Informatika dan Komputer",
    description:
      "Rumpun keilmuan rekayasa perangkat lunak, sistem cerdas, infrastruktur jaringan, dan keamanan informasi vokasi Politeknik Negeri Jakarta.",
    totalStudents: 1250,
    totalApplicants: 340,
    partnerCount: 12,
    readinessScore: 81.5,
    absorbedPercentage: 86.4,
    averageWaitTimeMonths: 2.1,
    studyPrograms: [
      { name: "Teknik Informatika", degree: "D4 (Sarjana Terapan)", studentsCount: 420, absorptionRate: 89.0 },
      { name: "Teknik Multimedia Digital", degree: "D4 (Sarjana Terapan)", studentsCount: 360, absorptionRate: 85.5 },
      { name: "Teknik Multimedia dan Jaringan", degree: "D4 (Sarjana Terapan)", studentsCount: 270, absorptionRate: 84.0 },
      { name: "Teknik Informatika Kampus PSDKU", degree: "D3 (Ahli Madya)", studentsCount: 200, absorptionRate: 87.2 },
    ],
    competencyGaps: [
      {
        skill: "System Architecture & Hexagonal Design",
        description: "Pemahaman arsitektur berlapis, clean architecture, dan pemisahan logika bisnis dari HTTP driver.",
        mitraDemand: "Kandidat sering gagal di tahap technical test karena menggabungkan logika database langsung ke handler API.",
        rpsRecommendation: "Pembaruan silabus Rekayasa Perangkat Lunak Terapan modul Ports & Adapters di semester 5.",
      },
      {
        skill: "Integration Testing & Automation",
        description: "Kemampuan merancang skenario automated test (Jest, Playwright, Testify) sebelum deployment.",
        mitraDemand: "Perusahaan software mensyaratkan test coverage minimal 80% pada proyek portofolio pelamar.",
        rpsRecommendation: "Penambahan modul praktikum Unit & End-to-End Testing pada mata kuliah Pemrograman Berbasis Objek.",
      },
      {
        skill: "Cloud Deployment & Container Security",
        description: "Orkestrasi kontainer Docker multi-stage dan pengelolaan secret aman pada pipeline CI/CD.",
        mitraDemand: "Mitra industri membutuhkan lulusan yang langsung siap mengelola container production tanpa celah keamanan.",
        rpsRecommendation: "Modul praktikum DevOps & Cloud Lab di semester 6 berbasis standar Open Container Initiative.",
      },
    ],
    recruitingPartners: [
      "PT Arunika Teknologi",
      "PT Bank Central Asia Tbk",
      "PT Telkom Indonesia (Persero) Tbk",
      "PT Astra Graphia Information Technology",
      "PT Bukalapak.com Tbk",
    ],
  },
  SIPIL: {
    code: "SIPIL",
    name: "Teknik Sipil",
    description:
      "Pusat keunggulan rekayasa konstruksi, perancangan infrastruktur jalan & jembatan, dan manajemen proyek bangunan gedung PNJ.",
    totalStudents: 1120,
    totalApplicants: 215,
    partnerCount: 8,
    readinessScore: 76.2,
    absorbedPercentage: 81.0,
    averageWaitTimeMonths: 2.8,
    studyPrograms: [
      { name: "Teknik Perancangan Jalan & Jembatan", degree: "D4 (Sarjana Terapan)", studentsCount: 380, absorptionRate: 83.0 },
      { name: "Manajemen Konstruksi", degree: "D4 (Sarjana Terapan)", studentsCount: 340, absorptionRate: 82.5 },
      { name: "Konstruksi Gedung", degree: "D3 (Ahli Madya)", studentsCount: 220, absorptionRate: 78.0 },
      { name: "Konstruksi Sipil", degree: "D3 (Ahli Madya)", studentsCount: 180, absorptionRate: 79.5 },
    ],
    competencyGaps: [
      {
        skill: "BIM Modeling (Revit & Navisworks)",
        description: "Penguasaan Building Information Modeling dimensi 3D, 4D (jadwal), dan 5D (anggaran biaya).",
        mitraDemand: "BUMN Karya mewajibkan seluruh pengawas dan drafter menguasai software BIM standar internasional.",
        rpsRecommendation: "Integrasi lisensi Autodesk dan modul praktikum Studio BIM Terpadu pada mata kuliah CAD Konstruksi.",
      },
      {
        skill: "Estimasi Biaya Proyek (RAB Standar PUPR)",
        description: "Perhitungan kuantitas volume (volume take-off) dan analisis harga satuan pekerjaan terkini.",
        mitraDemand: "Kandidat fresh graduate sering kali kurang presisi menghitung koefisien alat berat dan tenaga kerja.",
        rpsRecommendation: "Latihan studi kasus tender riil BUMN pada praktikum Estimasi Biaya & Rencana Kerja Syarat (RKS).",
      },
      {
        skill: "AutoCAD Civil 3D",
        description: "Desain geometrik jalan raya, kontur tanah, dan cut & fill volume otomatis.",
        mitraDemand: "Konsultan perencana jalan membutuhkan keahlian Civil 3D untuk efisiensi perancangan koridor jalan tol.",
        rpsRecommendation: "Workshop sertifikasi profesional Civil 3D menjelang semester akhir.",
      },
    ],
    recruitingPartners: [
      "PT Wijaya Karya (Persero) Tbk",
      "PT PP (Persero) Tbk",
      "PT Waskita Karya (Persero) Tbk",
      "PT Jaya Konstruksi Manggala Pratama Tbk",
    ],
  },
  MESIN: {
    code: "MESIN",
    name: "Teknik Mesin",
    description:
      "Rekayasa sistem manufaktur presisi, konversi energi pembangkit, dan otomasi perawatan mesin industri Politeknik Negeri Jakarta.",
    totalStudents: 1080,
    totalApplicants: 190,
    partnerCount: 9,
    readinessScore: 79.0,
    absorbedPercentage: 84.5,
    averageWaitTimeMonths: 2.3,
    studyPrograms: [
      { name: "Teknik Manufaktur", degree: "D4 (Sarjana Terapan)", studentsCount: 370, absorptionRate: 86.0 },
      { name: "Pembangkit Tenaga Listrik", degree: "D4 (Sarjana Terapan)", studentsCount: 310, absorptionRate: 85.0 },
      { name: "Teknik Mesin", degree: "D3 (Ahli Madya)", studentsCount: 400, absorptionRate: 82.5 },
    ],
    competencyGaps: [
      {
        skill: "PLC Programming (Siemens S7 & Omron)",
        description: "Pemrograman ladder diagram, fungsi logika sequence otomasi, dan integrasi HMI panel.",
        mitraDemand: "Pabrik otomotif dan consumer goods menuntut troubleshooting cepat pada sistem conveyor dan robot perakitan.",
        rpsRecommendation: "Pembaruan modul praktikum Mekatronika & Otomasi Industri dengan simulator PLC standar industri.",
      },
      {
        skill: "Quality Inspection & ISO 9001 Metrology",
        description: "Pengukuran presisi menggunakan Coordinate Measuring Machine (CMM) dan toleransi geometrik (GD&T).",
        mitraDemand: "Departemen QA/QC mitra membutuhkan inspektor dengan sertifikasi pembacaan toleransi mikrometer dan ISO.",
        rpsRecommendation: "Praktikum Metrologi Industri dengan standar audit kualitas part manufaktur ekspor.",
      },
      {
        skill: "SolidWorks Advanced Surface & FEA",
        description: "Simulasi kekuatan material statis/dinamis Finite Element Analysis dan pemodelan mold tooling.",
        mitraDemand: "Industri mould & dies memerlukan drafter yang mampu menganalisis titik tegangan sebelum proses fabrikasi.",
        rpsRecommendation: "Penyisipan modul FEA stress analysis pada mata kuliah Desain Elemen Mesin.",
      },
    ],
    recruitingPartners: [
      "PT Astra Honda Motor",
      "PT Toyota Motor Manufacturing Indonesia",
      "PT Komatsu Indonesia",
      "PT Schneider Electric Manufacturing Batam",
    ],
  },
  ELEKTRO: {
    code: "ELEKTRO",
    name: "Teknik Elektro",
    description:
      "Pengembangan teknologi instrumentasi kontrol industri, jaringan telekomunikasi seluler 5G, dan sistem tenaga listrik modern.",
    totalStudents: 1150,
    totalApplicants: 230,
    partnerCount: 10,
    readinessScore: 78.4,
    absorbedPercentage: 83.2,
    averageWaitTimeMonths: 2.4,
    studyPrograms: [
      { name: "Instrumentasi & Kontrol Industri", degree: "D4 (Sarjana Terapan)", studentsCount: 350, absorptionRate: 85.0 },
      { name: "Broadband Multimedia", degree: "D4 (Sarjana Terapan)", studentsCount: 320, absorptionRate: 82.0 },
      { name: "Teknik Listrik", degree: "D3 (Ahli Madya)", studentsCount: 260, absorptionRate: 83.5 },
      { name: "Teknik Telekomunikasi", degree: "D3 (Ahli Madya)", studentsCount: 220, absorptionRate: 81.0 },
    ],
    competencyGaps: [
      {
        skill: "SCADA Maintenance & Distributed Control",
        description: "Konfigurasi server telemetry, alarm management, dan komunikasi protokol Modbus/DNP3.",
        mitraDemand: "Sektor oil & gas dan utilitas membutuhkan teknisi yang mampu mengidentifikasi anomali sensor RTU seketika.",
        rpsRecommendation: "Praktikum Sistem SCADA & Telemetri Terdistribusi di Lab Otomasi Industri.",
      },
      {
        skill: "Power Circuit Design & Proteksi Relay",
        description: "Desain sistem penyaluran tenaga tegangan menengah dan koordinasi proteksi overcurrent relay.",
        mitraDemand: "Kontraktor elektrikal membutuhkan insinyur gardu induk yang paham regulasi SPLN dan IEC 61850.",
        rpsRecommendation: "Simulasi ETAP pada mata kuliah Analisis Sistem Tenaga Listrik.",
      },
      {
        skill: "Mikrokontroler STM32 & Embedded RTOS",
        description: "Pemrograman C/C++ firmware real-time multitasking pada mikrokontroler ARM Cortex-M.",
        mitraDemand: "Startup IoT dan industri smart metering menuntut efisiensi memory footprint dan battery optimization.",
        rpsRecommendation: "Proyek PBL Hardware-Software Co-Design berbasis FreeRTOS di semester 5.",
      },
    ],
    recruitingPartners: [
      "PT PLN (Persero)",
      "PT Huawei Tech Investment",
      "PT Siemens Indonesia",
      "PT Tripatra Engineers and Constructors",
    ],
  },
  TGP: {
    code: "TGP",
    name: "Teknik Grafika dan Penerbitan",
    description:
      "Pusat industri kreatif desain kemasan, manajemen produksi grafika, penerbitan media cetak & digital, dan desain komunikasi visual.",
    totalStudents: 890,
    totalApplicants: 165,
    partnerCount: 7,
    readinessScore: 82.1,
    absorbedPercentage: 87.1,
    averageWaitTimeMonths: 1.9,
    studyPrograms: [
      { name: "Desain Grafis", degree: "D4 (Sarjana Terapan)", studentsCount: 350, absorptionRate: 89.0 },
      { name: "Penerbitan (Jurnalistik)", degree: "D4 (Sarjana Terapan)", studentsCount: 280, absorptionRate: 85.0 },
      { name: "Teknik Grafika", degree: "D3 (Ahli Madya)", studentsCount: 260, absorptionRate: 87.0 },
    ],
    competencyGaps: [
      {
        skill: "Pre-press Color Separation & ICC Profiling",
        description: "Koreksi separasi warna CMYK, spot color Pantone, dan standarisasi ISO 12647 untuk cetak offset.",
        mitraDemand: "Industri percetakan komersial membutuhkan prepress specialist agar tidak terjadi deviasi warna pada mesin rotasi.",
        rpsRecommendation: "Praktikum Kalibrasi Warna Spektrofotometer pada mata kuliah Manajemen Warna Grafika.",
      },
      {
        skill: "Packaging Structural Layout (ArtiosCAD)",
        description: "Desain jaring-jaring pisau pond (die-cut) karton lipat dan corrugated box berkekuatan beban tinggi.",
        mitraDemand: "Pabrik kemasan ekspor mencari desainer kemasan yang memahami efisiensi yield lembaran plano.",
        rpsRecommendation: "Studio Desain Kemasan Struktural terintegrasi pengujian ketahanan jatuh (drop test).",
      },
      {
        skill: "Digital Editorial & Multi-platform Publishing",
        description: "Manajemen konten CMS multimedia, micro-copywriting, dan kurasi berita data interaktif.",
        mitraDemand: "Media digital nasional mencari jurnalis yang piawai memproduksi infografis data dan video reportase mobile.",
        rpsRecommendation: "Proyek Newsroom Terpadu berbasis analitik pembaca di semester 6.",
      },
    ],
    recruitingPartners: [
      "PT Gramedia Asri Media",
      "PT Kompas Media Nusantara",
      "PT Indofood CBP Sukses Makmur (Packaging Div)",
      "PT Duta Visual Nusantara Tivi Tujuh (Trans7)",
    ],
  },
  AKUNTANSI: {
    code: "AKUNTANSI",
    name: "Akuntansi",
    description:
      "Pendidikan vokasi akuntansi keuangan terapan, pemeriksaan internal (audit), manajemen perpajakan, dan analisis sistem perbankan.",
    totalStudents: 1340,
    totalApplicants: 280,
    partnerCount: 11,
    readinessScore: 84.0,
    absorbedPercentage: 88.5,
    averageWaitTimeMonths: 1.8,
    studyPrograms: [
      { name: "Keuangan dan Perbankan", degree: "D4 (Sarjana Terapan)", studentsCount: 480, absorptionRate: 90.0 },
      { name: "Manajemen Keuangan", degree: "D4 (Sarjana Terapan)", studentsCount: 420, absorptionRate: 88.0 },
      { name: "Akuntansi", degree: "D3 (Ahli Madya)", studentsCount: 440, absorptionRate: 87.5 },
    ],
    competencyGaps: [
      {
        skill: "Tax Planning & e-Faktur 3.0 Compliance",
        description: "Rekonsiliasi PPN/PPh badan, kepatuhan SPT Tahunan digital, dan perhitungan tax incentives terkini.",
        mitraDemand: "Kantor Konsultan Pajak dan korporasi mencari staf akuntan yang langsung fasih mengoperasikan DJP Online.",
        rpsRecommendation: "Simulasi Laboratorium Perpajakan Terapan dengan modul e-Faktur dan e-Bupot terintegrasi.",
      },
      {
        skill: "Audit Trail Analysis & Fraud Detection",
        description: "Verifikasi dokumen bukti transaksi beruntun menggunakan software data analysis (ACL / IDEA).",
        mitraDemand: "Firma Kantor Akuntan Publik (KAP) Big Four menuntut kemampuan sampling audit analitis berbantuan komputer.",
        rpsRecommendation: "Pembaruan silabus Audit Berbantuan Komputer (TABK) dengan dataset transaksi korporasi riil.",
      },
      {
        skill: "SAP FICO (Financial & Controlling) Basics",
        description: "Pencatatan general ledger, accounts payable/receivable, dan closing laporan keuangan di ERP terkemuka.",
        mitraDemand: "Perusahaan multinasional memprioritaskan kandidat yang telah memiliki pengenalan navigasi SAP ERP.",
        rpsRecommendation: "Sertifikasi ERP SAP University Alliance untuk seluruh mahasiswa semester 6.",
      },
    ],
    recruitingPartners: [
      "PwC Indonesia (KAP Tanudiredja, Wibisana, Rintis & Rekan)",
      "PT Bank Mandiri (Persero) Tbk",
      "PT Bank Rakyat Indonesia (Persero) Tbk",
      "KAP Ernst & Young Indonesia",
    ],
  },
  AN: {
    code: "AN",
    name: "Administrasi Niaga",
    description:
      "Pendidikan profesional tata kelola bisnis internasional, logistik rantai pasok ekspor-impor, dan strategi pemasaran korporat.",
    totalStudents: 1210,
    totalApplicants: 245,
    partnerCount: 8,
    readinessScore: 80.6,
    absorbedPercentage: 85.0,
    averageWaitTimeMonths: 2.2,
    studyPrograms: [
      { name: "Manajemen Bisnis Internasional", degree: "D4 (Sarjana Terapan)", studentsCount: 430, absorptionRate: 87.0 },
      { name: "Manajemen Pemasaran", degree: "D4 (Sarjana Terapan)", studentsCount: 390, absorptionRate: 85.5 },
      { name: "Administrasi Bisnis", degree: "D3 (Ahli Madya)", studentsCount: 390, absorptionRate: 82.5 },
    ],
    competencyGaps: [
      {
        skill: "Prosedur Ekspor-Impor & Kepabeanan",
        description: "Penyusunan dokumen Letter of Credit (L/C), Bill of Lading, Pemberitahuan Ekspor Barang (PEB), dan Incoterms 2020.",
        mitraDemand: "Perusahaan freight forwarding dan logistik maritim membutuhkan staf operasional yang cermat memvalidasi dokumen HS Code.",
        rpsRecommendation: "Simulasi Terpadu Kepabeanan & Logistik Pelabuhan pada mata kuliah Ekspor-Impor Terapan.",
      },
      {
        skill: "CRM Data Management (HubSpot / Salesforce)",
        description: "Pengelolaan sales pipeline, lead qualification, dan otomatisasi komunikasi pelanggan korporat.",
        mitraDemand: "Perusahaan teknologi dan B2B membutuhkan account executive yang terbiasa melacak metrik konversi di CRM.",
        rpsRecommendation: "Proyek PBL Pemasaran B2B dengan praktik pengelolaan akun di cloud CRM platform.",
      },
      {
        skill: "Business English Negotiation & Pitching",
        description: "Kemampuan presentasi penawaran kerja sama, negosiasi kontrak bilateral, dan korespondensi formal internasional.",
        mitraDemand: "Mitra korporat multinasional mensyaratkan kelancaran komunikasi lisan bahasa Inggris profesional pada wawancara.",
        rpsRecommendation: "Workshop simulasi Negosiasi Kontrak Bisnis Global dengan pembicara praktisi expatriate.",
      },
    ],
    recruitingPartners: [
      "PT Samudera Indonesia Tbk",
      "PT Unilever Indonesia Tbk",
      "PT DHL Supply Chain Indonesia",
      "PT Shopee International Indonesia",
    ],
  },
};

