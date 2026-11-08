"""Modul validasi bukti dokumen sertifikasi/portofolio via ekstraksi teks,
fuzzy cross-matching terhadap CV asli, dan proteksi anti-prompt injection.
"""

from __future__ import annotations

import unicodedata
from rapidfuzz import fuzz

from app.prompt_guard import looks_like_prompt_attack, _normalize_for_detection


def sanitize_evidence_text(text: str) -> str:
    """Normalisasi NFKC dan bersihkan zero-width/kontrol tersembunyi."""
    if not text:
        return ""
    normalized = unicodedata.normalize("NFKC", text)
    # Hapus karakter invisible / zero-width
    sanitized = "".join(
        ch for ch in normalized
        if unicodedata.category(ch) != "Cf" or ch in ("\n", "\t", "\r")
    )
    return sanitized.strip()


def validate_claim_evidence(
    claim_title: str,
    claim_context: str,
    evidence_text: str,
    student_name: str = "",
) -> dict:
    """Validasi teks dokumen sertifikat terhadap klaim CV.

    Return dict dengan status:
    - 'verified': Bukti cocok dan valid.
    - 'needs_manual_review': Kecocokan parsial atau scan buram.
    - 'rejected': Injeksi prompt terdeteksi atau dokumen tidak sesuai.
    """
    clean_evidence = sanitize_evidence_text(evidence_text)
    if not clean_evidence:
        return {
            "status": "needs_manual_review",
            "match_confidence": 0.0,
            "is_injection": False,
            "notes": "Teks bukti tidak dapat diekstrak (scan dokumen visual murni/non-scannable), butuh review manual prodi.",
        }

    # 1. Pertahanan Anti Prompt Injection (Pre-Verification)
    if looks_like_prompt_attack(clean_evidence):
        return {
            "status": "rejected",
            "match_confidence": 0.0,
            "is_injection": True,
            "notes": "Dokumen bukti ditolak otomatis karena terdeteksi instruksi jailbreak/prompt injection di dalam teks.",
        }

    # 2. Fuzzy Cross-Matching terhadap Nama Sertifikat / Klaim
    title_score = fuzz.token_set_ratio(claim_title.lower(), clean_evidence.lower()) / 100.0

    context_score = 0.0
    if claim_context:
        context_score = fuzz.partial_ratio(claim_context.lower(), clean_evidence.lower()) / 100.0

    # 3. Pengecekan Nama Mahasiswa (opsional jika student_name diberikan)
    name_score = 1.0
    if student_name:
        name_score = fuzz.partial_ratio(student_name.lower(), clean_evidence.lower()) / 100.0

    # Bobot skor: 60% judul klaim + 25% konteks CV + 15% kesesuaian nama
    overall_confidence = (title_score * 0.60) + (context_score * 0.25) + (name_score * 0.15)
    overall_confidence = round(min(1.0, max(0.0, overall_confidence)), 2)

    if overall_confidence >= 0.75:
        return {
            "status": "verified",
            "match_confidence": overall_confidence,
            "is_injection": False,
            "notes": f"Sertifikat tervalidasi dengan tingkat kecocokan teks {int(overall_confidence * 100)}% terhadap klaim CV.",
        }
    elif overall_confidence >= 0.45:
        return {
            "status": "needs_manual_review",
            "match_confidence": overall_confidence,
            "is_injection": False,
            "notes": f"Kecocokan parsial ({int(overall_confidence * 100)}%). Membutuhkan tinjauan manual oleh admin prodi.",
        }
    else:
        return {
            "status": "rejected",
            "match_confidence": overall_confidence,
            "is_injection": False,
            "notes": f"Isi dokumen tidak cocok dengan klaim sertifikasi di CV (skor {int(overall_confidence * 100)}%).",
        }

