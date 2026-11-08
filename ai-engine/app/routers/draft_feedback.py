"""Job draft_feedback: draf surat feedback terstruktur dari bukti hasil score.

Bentuknya mengikuti FeedbackData di frontend/lib/data/student.ts (ringkasan, kekuatan,
area pengembangan, penutup) supaya halaman feedback mahasiswa bisa menampilkan
langkah konkret per kompetensi. Mata kuliah diisi backend dari peta prodi,
bukan dikarang model.

Ini DRAF untuk HR. Backend menolak mengirimnya sebelum HR mereview
(usecase.ReviewFeedback). Keputusan seleksi selalu milik HR.
"""

from __future__ import annotations

import json
import time

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.logging import log_ai_call
from app.prompt_guard import INJECTION_GUARD, wrap_untrusted
from app.providers import get_provider_for_task

router = APIRouter()

PROMPT_VERSION = "draft-feedback-v2"

_SYSTEM_PROMPT = (
    "Kamu menulis DRAF feedback untuk mahasiswa yang melamar lewat layanan karier kampus. "
    "Draf ini akan dibaca, diedit, dan dikirim oleh HR; keputusan akhir selalu ada di HR. "
    "Bahasa Indonesia hangat, santai, sopan, pakai \"kamu\", tanpa tanda pisah panjang. "
    'Balas HANYA JSON valid: {"ringkasan": string, "kekuatan": [string], '
    '"area": [{"kompetensi": string, "kenapa": string, "saran": string}], "penutup": string}. '
    "ringkasan: 2-3 kalimat, terima kasih sudah melamar posisi ini dan gambaran umum berbasis bukti. "
    "kekuatan: 2-3 poin yang punya bukti, sebut buktinya. "
    "area: 2-3 kompetensi dari syarat berstatus Sebagian atau Tidak ditemukan, utamakan syarat wajib; "
    "kompetensi = nama singkat kompetensinya, kenapa = apa yang belum terlihat dari CV atau jawaban, "
    "saran = satu langkah konkret (proyek, latihan, atau sertifikasi) yang bisa dikerjakan. "
    "penutup: satu kalimat menyemangati. "
    "Nilai buktinya, bukan orangnya: jangan menulis kalimat yang terdengar seperti vonis atas pribadi "
    "kandidat. Jangan menyebut skor angka atau nama kategori. Jangan menjanjikan atau memutuskan hasil seleksi."
    "\n\n" + INJECTION_GUARD
)


class BuktiRingkas(BaseModel):
    syarat: str
    wajib: bool = False
    status: str
    kutipan: str | None = None


class DraftFeedbackRequest(BaseModel):
    posisi: str
    kategori: str
    alasan: str = ""
    bukti: list[BuktiRingkas] = Field(default_factory=list)


class Area(BaseModel):
    kompetensi: str = ""
    kenapa: str = ""
    saran: str = ""
    matkul: str = ""


class DraftFeedbackResponse(BaseModel):
    ringkasan: str = ""
    kekuatan: list[str] = Field(default_factory=list)
    area: list[Area] = Field(default_factory=list)
    penutup: str = ""


def parse_draft(raw: str) -> DraftFeedbackResponse:
    try:
        data = json.loads(raw)
        if not isinstance(data, dict):
            raise ValueError("bukan objek")
        return DraftFeedbackResponse(
            ringkasan=str(data.get("ringkasan") or "").strip(),
            kekuatan=[str(k).strip() for k in data.get("kekuatan") or [] if str(k).strip()][:3],
            area=[Area(kompetensi=str(a.get("kompetensi") or ""), kenapa=str(a.get("kenapa") or ""), saran=str(a.get("saran") or ""))
                  for a in data.get("area") or [] if isinstance(a, dict)][:3],
            penutup=str(data.get("penutup") or "").strip(),
        )
    except (json.JSONDecodeError, ValueError, TypeError, AttributeError) as exc:
        raise HTTPException(status_code=502, detail="model mengembalikan format draf yang tidak valid") from exc


@router.post("", response_model=DraftFeedbackResponse)
async def draft_feedback(payload: DraftFeedbackRequest) -> DraftFeedbackResponse:
    # Kategori ikut supaya nada surat sesuai, tapi prompt melarang menyebutnya.
    prompt = "\n\n".join(
        [
            f"POSISI: {payload.posisi}\nKATEGORI_REKOMENDASI_AI: {payload.kategori}",
            wrap_untrusted("RINGKASAN_BUKTI", payload.alasan or "(tidak ada)"),
            wrap_untrusted("BUKTI_PER_SYARAT", json.dumps([b.model_dump() for b in payload.bukti], ensure_ascii=False)),
        ]
    )
    provider = get_provider_for_task("complete")
    started = time.monotonic()
    raw = await provider.complete(prompt, system=_SYSTEM_PROMPT, json_mode=True)
    log_ai_call(provider="default", model=provider.COMPLETE_MODEL, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)
    return parse_draft(raw)
