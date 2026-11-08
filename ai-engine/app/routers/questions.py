"""Job questions: 3 pertanyaan pre-screening + 3 AI Interview per lowongan.

Diadaptasi dari generator pertanyaan direkrut-AI (assessment.py), dengan dua
penyesuaian Pintu Karier: pertanyaan dibuat per LOWONGAN, bukan per pelamar, supaya
semua kandidat dinilai dengan pertanyaan yang sama; dan jumlahnya 3 + 3
(teknis, perilaku STAR, situasional) sesuai alur mahasiswa di concept paper.
"""

from __future__ import annotations

import json
import time

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.logging import log_ai_call
from app.prompt_guard import INJECTION_GUARD, wrap_untrusted
from app.providers import get_provider_for_task

router = APIRouter()

PROMPT_VERSION = "questions-v1"
JUMLAH = 3

_SYSTEM_PROMPT = (
    "Kamu membantu HR mitra kampus menyusun pertanyaan seleksi untuk mahasiswa vokasi dan fresh graduate. "
    "Bahasa Indonesia santai dan sopan, pakai \"kamu\", tanpa tanda pisah panjang. "
    'Balas HANYA JSON valid: {"prescreen": [string, string, string], "interview": [string, string, string]}. '
    "prescreen = 3 pertanyaan singkat yang bisa dijawab dalam 1-2 kalimat untuk memastikan syarat dasar "
    "(ketersediaan, kesesuaian lokasi/sistem kerja, dan tautan portofolio atau bukti karya yang relevan). "
    "interview = 3 pertanyaan lisan yang dijawab sekitar 2 menit: (1) teknis tentang salah satu syarat wajib, "
    "(2) perilaku dengan format STAR tentang proyek, magang, atau organisasi, (3) situasional yang relevan "
    "dengan posisi. Jangan menanyakan umur, agama, status pernikahan, atau data pribadi lain."
    "\n\n" + INJECTION_GUARD
)

# Cadangan bila model gagal; sama dengan domain.DefaultPrescreen/DefaultInterview di backend.
FALLBACK_PRESCREEN = [
    "Kapan kamu bisa mulai bekerja atau magang?",
    "Oke dengan lokasi dan sistem kerja di lowongan ini? Ceritain singkat kondisimu.",
    "Link portofolio, GitHub, atau contoh hasil kerja kamu?",
]
FALLBACK_INTERVIEW = [
    "Ceritain satu proyek yang paling kamu banggain dan relevan sama posisi ini. Peran kamu di situ apa?",
    "Pernah ketemu masalah teknis yang bikin pusing? Gimana cara kamu nemuin dan beresinnya?",
    "Kalau tenggat mepet dan kebutuhan berubah di tengah jalan, apa yang kamu lakuin?",
]


class QuestionsRequest(BaseModel):
    posisi: str
    deskripsi: str = ""
    wajib: list[str]
    plus: list[str] = Field(default_factory=list)


class QuestionsResponse(BaseModel):
    prescreen: list[str]
    interview: list[str]


def pick(data: object, key: str, fallback: list[str]) -> list[str]:
    """Ambil tepat 3 pertanyaan non-kosong; kurang dari itu pakai cadangan utuh."""
    items = data.get(key) if isinstance(data, dict) else None
    clean = [str(q).strip() for q in items or [] if str(q).strip()] if isinstance(items, list) else []
    return clean[:JUMLAH] if len(clean) >= JUMLAH else list(fallback)


@router.post("", response_model=QuestionsResponse)
async def questions(payload: QuestionsRequest) -> QuestionsResponse:
    prompt = "\n\n".join([
        f"POSISI: {payload.posisi}",
        wrap_untrusted("DESKRIPSI_LOWONGAN", payload.deskripsi or "(tidak ada)"),
        "SYARAT_WAJIB: " + json.dumps(payload.wajib, ensure_ascii=False),
        "SYARAT_NILAI_PLUS: " + json.dumps(payload.plus, ensure_ascii=False),
    ])
    provider = get_provider_for_task("complete")
    started = time.monotonic()
    raw = await provider.complete(prompt, system=_SYSTEM_PROMPT, json_mode=True)
    log_ai_call(provider="default", model=provider.COMPLETE_MODEL, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        data = {}
    return QuestionsResponse(prescreen=pick(data, "prescreen", FALLBACK_PRESCREEN), interview=pick(data, "interview", FALLBACK_INTERVIEW))
