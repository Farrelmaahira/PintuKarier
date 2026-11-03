"""Job transcribe: satu rekaman jawaban AI Interview -> teks + durasi.

Teksnya jadi sumber bukti "AI Interview" di job score. Durasi ditampilkan di
transkrip halaman kandidat HRD.
"""

from __future__ import annotations

import time

from fastapi import APIRouter
from pydantic import BaseModel

from app.files import FileRequest, decode_file
from app.logging import log_ai_call
from app.providers import GroqProvider, get_provider_for_task

router = APIRouter()


class TranscribeResponse(BaseModel):
    teks: str
    durasi_detik: float | None = None


@router.post("", response_model=TranscribeResponse)
async def transcribe(payload: FileRequest) -> TranscribeResponse:
    audio_bytes = decode_file(payload)
    provider = get_provider_for_task("transcribe")
    started = time.monotonic()
    teks, durasi = await provider.transcribe(audio_bytes, filename=payload.filename)
    model = provider.WHISPER_MODEL if isinstance(provider, GroqProvider) else provider.COMPLETE_MODEL
    log_ai_call(provider="transcribe", model=model, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)
    return TranscribeResponse(teks=teks.strip(), durasi_detik=durasi)
