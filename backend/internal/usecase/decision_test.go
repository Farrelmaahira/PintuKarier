package usecase

import (
	"testing"

	"pintukarier-backend/internal/domain"
)

func TestCorrectCategoryNeedsReason(t *testing.T) {
	if _, err := CorrectCategory(domain.CategoryDipertimbangkan, "Memenuhi Kriteria", ""); err == nil {
		t.Fatal("expected error for empty reason")
	}
}

func TestCorrectCategoryRejectsUnknown(t *testing.T) {
	if _, err := CorrectCategory(domain.CategoryDipertimbangkan, "Lulus", "bukti kuat"); err == nil {
		t.Fatal("expected error for unknown category")
	}
}

func TestCorrectCategoryAccepts(t *testing.T) {
	c, err := CorrectCategory(domain.CategoryDipertimbangkan, "Memenuhi Kriteria", "portofolio React terbukti")
	if err != nil {
		t.Fatalf("CorrectCategory: %v", err)
	}
	if c != domain.CategoryMemenuhi {
		t.Fatalf("category = %q", c)
	}
}

func TestReviewFeedbackNeedsReview(t *testing.T) {
	if _, err := ReviewFeedback("Tingkatkan testing otomatis dengan Jest dan Playwright.", false); err == nil {
		t.Fatal("expected error when HR has not reviewed")
	}
	if _, err := ReviewFeedback("OK", true); err == nil {
		t.Fatal("expected error for too-short feedback")
	}
	out, err := ReviewFeedback("SQL lanjutan kurang: pelajari window function via dataset transaksi mitra.", true)
	if err != nil {
		t.Fatalf("ReviewFeedback: %v", err)
	}
	if out == "" {
		t.Fatal("expected non-empty feedback")
	}
}

func TestCorrectCategoryKeepsAIWithoutReason(t *testing.T) {
	c, err := CorrectCategory(domain.CategoryDipertimbangkan, "", "")
	if err != nil || c != domain.CategoryDipertimbangkan {
		t.Fatalf("got %q %v", c, err)
	}
	if c, err := CorrectCategory(domain.CategoryDipertimbangkan, "Perlu Dipertimbangkan", ""); err != nil || c != domain.CategoryDipertimbangkan {
		t.Fatalf("same category got %q %v", c, err)
	}
	if !ValidDecision("Lolos") || ValidDecision("Diterima") {
		t.Fatal("ValidDecision salah")
	}
}
