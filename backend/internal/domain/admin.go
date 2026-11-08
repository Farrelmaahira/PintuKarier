package domain

// AdminOverview data makro satu kampus (7 jurusan PNJ).
type AdminOverview struct {
	TotalMahasiswa     int                   `json:"total_mahasiswa"`
	TotalLowongan      int                   `json:"total_lowongan"`
	TotalMitra         int                   `json:"total_mitra"`
	TotalLamaran       int                   `json:"total_lamaran"`
	PersentaseFeedback float64               `json:"persentase_feedback"`
	RataKesiapan       float64               `json:"rata_kesiapan"`
	RingkasanJurusan   []AdminJurusanSummary `json:"ringkasan_jurusan"`
}

// AdminJurusanSummary data agregat per jurusan vokasi PNJ.
type AdminJurusanSummary struct {
	KodeJurusan      string   `json:"kode"`
	NamaJurusan      string   `json:"nama"`
	TotalMahasiswa   int      `json:"total_mahasiswa"`
	TotalPelamar     int      `json:"total_pelamar"`
	TingkatKesiapan  float64  `json:"tingkat_kesiapan"`
	KesenjanganSkill []string `json:"kesenjangan_skill"`
	MitraPerekrut    int      `json:"mitra_perekrut"`
}

// AdminMitraSummary data kemitraan industri dan kepatuhan SLA feedback.
type AdminMitraSummary struct {
	ID               string  `json:"id"`
	NamaPerusahaan   string  `json:"nama_perusahaan"`
	BidangIndustri   string  `json:"bidang_industri"`
	JumlahLowongan   int     `json:"jumlah_lowongan"`
	JumlahPelamar    int     `json:"jumlah_pelamar"`
	FeedbackTerkirim int     `json:"feedback_terkirim"`
	SLAFeedback      float64 `json:"sla_feedback"`
	StatusKemitraan  string  `json:"status_kemitraan"`
}
