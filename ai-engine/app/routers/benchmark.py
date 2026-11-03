"""Benchmark per fitur: Groq vs Gemini vs manual.

Tiap provider teks yang punya API key menjalankan fitur asli (prompt dan
parser router yang sama dengan produksi) pada satu kandidat contoh, lalu
waktunya diukur. Pengukuran jalan saat endpoint dipanggil dan tidak menyimpan
apa pun di memori: instance Cloud Run bisa mati kapan saja dan CPU-nya
dibatasi di luar request. Backend yang menjadwalkan dan menyimpan hasilnya.
"""

from __future__ import annotations

import asyncio
import logging
import time
from collections.abc import Awaitable, Callable

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import get_settings
from app.prompt_guard import wrap_untrusted
from app.providers import AIProvider, GeminiProvider, GroqProvider, get_provider_for_task, paksa_provider
from app.routers import draft_feedback as df
from app.routers import parse_cv as pc
from app.routers import questions as q
from app.routers import score as sc

router = APIRouter()

# Batas per fitur, dipasang dari luar thread-nya: SDK Gemini (gRPC) bisa memblokir loop-nya sendiri.
# 4 fitur berurutan per provider harus muat di timeout request Cloud Run (300 dtk).
_BATAS_DETIK = 45

_POSISI, _WAJIB, _PLUS = "Frontend Developer Intern", ["React", "TypeScript"], ["Testing otomatis"]
_CV = (
    "Raka Pratama, D4 Teknik Informatika semester 6. Proyek PBL SiPinjam: membangun dashboard peminjaman "
    "alat dengan React dan TypeScript, deploy di Vercel. Magang 3 bulan di startup lokal membuat landing page."
)
# shortcut: waktu manual HRD masih estimasi tim, ganti dengan hasil ukur nyata kalau sudah ada.
MANUAL_DETIK = {
    "Ekstraksi CV": 5 * 60,
    "Pertanyaan interview": 20 * 60,
    "Evidence-Based Scoring": 15 * 60,
    "Draft feedback": 10 * 60,
}


class Hasil(BaseModel):
    fitur: str
    nama: str
    detik: float | None  # None = gagal atau timeout


async def _ekstraksi_cv() -> object:
    provider = get_provider_for_task("complete")
    raw = await provider.complete(wrap_untrusted("ISI_CV", _CV), system=pc._EXTRACTION_SYSTEM_PROMPT, json_mode=True)
    return pc._parse_profil(raw)


_FITUR: dict[str, Callable[[], Awaitable[object]]] = {
    "Ekstraksi CV": _ekstraksi_cv,
    "Pertanyaan interview": lambda: q.questions(q.QuestionsRequest(posisi=_POSISI, wajib=_WAJIB, plus=_PLUS)),
    "Evidence-Based Scoring": lambda: sc.score(sc.ScoreRequest(posisi=_POSISI, wajib=_WAJIB, plus=_PLUS, cv_teks=_CV)),
    "Draft feedback": lambda: df.draft_feedback(
        df.DraftFeedbackRequest(
            posisi=_POSISI,
            kategori="Perlu Dipertimbangkan",
            alasan="React dan TypeScript terbukti di proyek PBL, testing otomatis belum ada buktinya.",
            bukti=[df.BuktiRingkas(syarat="Testing otomatis", status="Tidak ditemukan")],
        )
    ),
}

def _providers() -> list[Callable[[], AIProvider]]:
    """Pabrik, bukan instance: tiap fitur jalan di event loop sendiri, client async tidak boleh dipakai lintas loop."""
    settings = get_settings()
    out: list[Callable[[], AIProvider]] = []
    if settings.groq_api_key:
        out.append(GroqProvider)
    if settings.gemini_api_key:
        out.append(GeminiProvider)
    return out


def _nama(provider: AIProvider) -> str:
    return f"{type(provider).__name__.removesuffix('Provider')} · {provider.COMPLETE_MODEL}"


async def _uji(provider: AIProvider, fitur: str) -> Hasil:
    async def jalan() -> float:
        paksa_provider.set(provider)
        mulai = time.monotonic()
        try:
            await _FITUR[fitur]()
            return round(time.monotonic() - mulai, 1)
        finally:
            # Tutup client async di loop thread ini; kalau dibiarkan, GC menutupnya di loop lain dan error.
            if (client := getattr(provider, "_client", None)) is not None:
                await client.close()

    try:
        detik: float | None = await asyncio.wait_for(asyncio.to_thread(asyncio.run, jalan()), _BATAS_DETIK)
    except Exception as exc:
        logging.getLogger("benchmark").warning("benchmark %s %s gagal: %r", _nama(provider), fitur, exc)
        detik = None
    return Hasil(fitur=fitur, nama=_nama(provider), detik=detik)


async def _uji_provider(buat: Callable[[], AIProvider]) -> list[Hasil]:
    # Fitur satu provider berurutan: tidak kena rate limit dan latensinya tidak saling mengganggu.
    return [await _uji(buat(), f) for f in _FITUR]


@router.post("", response_model=list[Hasil])
async def benchmark() -> list[Hasil]:
    """Ukur semua provider (paralel antar provider). 502 kalau tidak ada model yang berhasil di satu fitur pun."""
    ai = [h for hasil in await asyncio.gather(*(_uji_provider(b) for b in _providers())) for h in hasil]
    if not any(h.detik is not None for h in ai):
        raise HTTPException(status_code=502, detail="tidak ada model yang berhasil diukur")
    manual = [Hasil(fitur=f, nama="Manual (estimasi)", detik=d) for f, d in MANUAL_DETIK.items()]
    return sorted(ai + manual, key=lambda h: list(_FITUR).index(h.fitur))
