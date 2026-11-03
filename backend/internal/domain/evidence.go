package domain

import "errors"

// EvidenceStatus tiga status wajib README: Terpenuhi, Sebagian, Tidak ditemukan.
type EvidenceStatus string

const (
	EvidenceTerpenuhi      EvidenceStatus = "Terpenuhi"
	EvidenceSebagian       EvidenceStatus = "Sebagian"
	EvidenceTidakDitemukan EvidenceStatus = "Tidak ditemukan"
)

type EvidenceSource string

const (
	SourceCV           EvidenceSource = "CV"
	SourcePrescreening EvidenceSource = "Pre-screening"
	SourceInterview    EvidenceSource = "AI Interview"
)

type Evidence struct {
	Requirement string
	Status      EvidenceStatus
	Source      EvidenceSource
	Quote       string
	Mandatory   bool
	Baseline    bool
}

func (e Evidence) Validate() error {
	switch e.Status {
	case EvidenceTerpenuhi, EvidenceSebagian, EvidenceTidakDitemukan:
	default:
		return errors.New("status evidence tidak dikenal")
	}
	if (e.Status == EvidenceTerpenuhi || e.Status == EvidenceSebagian) && e.Quote == "" {
		return errors.New("evidence Terpenuhi/Sebagian wajib sertakan kutipan")
	}
	return nil
}
