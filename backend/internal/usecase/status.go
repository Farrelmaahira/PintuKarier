package usecase

import (
	"fmt"
	"time"

	"pintukarier-backend/internal/domain"
)

type LamaranStatus struct {
	Tahap   int
	Status  string
	Catatan string
}

func StatusLamaran(stage domain.ApplicationStage, decision string) LamaranStatus {
	switch stage {
	case domain.StageProfile:
		return LamaranStatus{1, "Lengkapi lamaran", "Profil udah beres. Tinggal jawab 3 pertanyaan pre-screening."}
	case domain.StagePrescreening:
		return LamaranStatus{2, "AI Interview", "CV dan pre-screening beres. Tinggal AI Interview, sekitar 10 menit."}
	case domain.StageInterview:
		return LamaranStatus{3, "Dianalisis AI", "Jawaban kamu lagi ditranskripsi dan dinilai. Hasilnya dibaca HRD, bukan diputus AI."}
	case domain.StageScored:
		return LamaranStatus{4, "Dicek HRD", "Keputusan akhir tetap di tangan mereka. Mohon ditunggu ya..."}
	case domain.StageDecided:
		if decision == KeputusanLolos {
			return LamaranStatus{5, "Lolos", "Selamat, kamu lolos tahap ini. HRD bakal hubungi kamu buat langkah berikutnya."}
		}
		return LamaranStatus{5, "Belum lolos", "Belum rezeki, tapi feedback kompetensinya udah bisa kamu baca."}
	}
	return LamaranStatus{0, "Lengkapi lamaran", "Unggah CV dan cek profil kamu dulu, abis itu jawab 3 pertanyaan singkat."}
}

var bulanID = [...]string{"Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"}

func TanggalID(t, now time.Time) string {
	if t.IsZero() {
		return ""
	}
	if y, m, d := t.Date(); y == now.Year() && m == now.Month() && d == now.Day() {
		return "Hari ini"
	}
	return fmt.Sprintf("%d %s %d", t.Day(), bulanID[t.Month()-1], t.Year())
}
