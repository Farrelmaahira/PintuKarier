"""Abstraksi provider AI biar model-agnostic.

Router di app/routers/ manggil get_provider_for_task() daripada import SDK
provider tertentu secara langsung, jadi provider bisa diganti tanpa ubah
logika bisnis (README 5.5).

Groq (Llama) dipakai buat completion berbasis teks (parse CV, scoring,
feedback). Gemini (flash-lite) dipakai buat CV berformat gambar karena Llama
Groq gak nerima input vision. Groq Whisper dipakai buat transkrip interview.
"""

from __future__ import annotations

import asyncio
from abc import ABC, abstractmethod
from contextvars import ContextVar
from typing import Any, Awaitable, Callable, TypeVar

from app.config import get_settings

T = TypeVar("T")


_TIMEOUT_SECONDS = 30.0
_MAX_RETRIES = 1
_RETRY_BACKOFF_SECONDS = 1.5


async def _with_timeout_and_retry(fn: Callable[[], Awaitable[T]]) -> T:
    """Timeout eksplisit + satu retry buat error transient (timeout, 5xx,
    connection reset). BUKAN buat 4xx -- retry request yang emang salah
    cuma buang-buang quota provider buat kegagalan yang sama."""
    last_exc: Exception | None = None
    for attempt in range(_MAX_RETRIES + 1):
        try:
            return await asyncio.wait_for(fn(), timeout=_TIMEOUT_SECONDS)
        except TimeoutError as exc:
            last_exc = exc
        except Exception as exc:  # noqa: BLE001 -- SDK provider beda-beda tipe exception-nya
            status_code = getattr(exc, "status_code", None)
            if status_code is not None and status_code < 500:
                raise
            last_exc = exc

        if attempt < _MAX_RETRIES:
            await asyncio.sleep(_RETRY_BACKOFF_SECONDS)

    assert last_exc is not None
    raise last_exc


class AIProvider(ABC):
    """Kontrak minimal yang harus dipenuhi tiap provider AI."""

    @property
    @abstractmethod
    def COMPLETE_MODEL(self) -> str:
        """Nama model utama yang dipakai untuk completion."""

    @abstractmethod
    async def complete(self, prompt: str, *, system: str | None = None, json_mode: bool = False) -> str:
        """Generate teks dari prompt. json_mode=True minta provider menjamin
        balasan JSON valid (temperature 0 biar scoring stabil)."""
        raise NotImplementedError

    @abstractmethod
    async def transcribe(self, audio_bytes: bytes, *, filename: str = "audio.wav") -> tuple[str, float | None]:
        """Speech-to-text. Balikin (teks, durasi detik kalau provider tahu)."""
        raise NotImplementedError


class GeminiProvider(AIProvider):
    COMPLETE_MODEL = "gemini-flash-lite-latest"

    def __init__(self) -> None:
        import google.generativeai as genai

        settings = get_settings()
        genai.configure(api_key=settings.gemini_api_key)
        self._genai = genai

    async def complete(
        self,
        prompt: str,
        *,
        system: str | None = None,
        json_mode: bool = False,
        image_bytes: bytes | None = None,
        image_mime_type: str = "image/jpeg",
    ) -> str:
        """Bisa nerima teks doang atau teks+gambar (vision) -- dipakai
        parse_cv.py buat CV yang di-upload sebagai foto."""
        config: dict[str, Any] = {"response_mime_type": "application/json", "temperature": 0} if json_mode else {}
        model = self._genai.GenerativeModel(self.COMPLETE_MODEL, system_instruction=system, generation_config=config)
        content: list[Any] = [prompt]
        if image_bytes is not None:
            content.append({"mime_type": image_mime_type, "data": image_bytes})

        async def _call() -> str:
            response = await model.generate_content_async(content)
            return response.text or ""

        return await _with_timeout_and_retry(_call)

    async def transcribe(self, audio_bytes: bytes, *, filename: str = "audio.wav") -> tuple[str, float | None]:
        raise NotImplementedError("Gemini provider belum handle audio -- pakai GroqProvider.transcribe()")


class GroqProvider(AIProvider):
    # Model teks lewat env GROQ_MODEL: Groq memensiunkan model tanpa ubah kode (llama-3.3-70b-versatile sudah tiada).
    COMPLETE_MODEL = "openai/gpt-oss-120b"
    WHISPER_MODEL = "whisper-large-v3"

    def __init__(self) -> None:
        from groq import AsyncGroq

        settings = get_settings()
        self._client = AsyncGroq(api_key=settings.groq_api_key)
        self.COMPLETE_MODEL = settings.groq_model

    async def complete(self, prompt: str, *, system: str | None = None, json_mode: bool = False) -> str:
        messages: list[dict[str, str]] = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        extra: dict[str, Any] = {"response_format": {"type": "json_object"}, "temperature": 0} if json_mode else {"temperature": 0.2}

        async def _call() -> str:
            response = await self._client.chat.completions.create(
                model=self.COMPLETE_MODEL,
                messages=messages,  # type: ignore[arg-type]
                **extra,
            )
            return response.choices[0].message.content or ""

        return await _with_timeout_and_retry(_call)

    async def transcribe(self, audio_bytes: bytes, *, filename: str = "audio.wav") -> tuple[str, float | None]:
        async def _call() -> tuple[str, float | None]:
            response = await self._client.audio.transcriptions.create(
                model=self.WHISPER_MODEL,
                file=(filename, audio_bytes),
                response_format="verbose_json",
            )
            # verbose_json bawa durasi audio sebagai field ekstra di model SDK.
            duration = getattr(response, "duration", None)
            return response.text, (float(duration) if duration is not None else None)

        return await _with_timeout_and_retry(_call)


_PROVIDERS: dict[str, type[AIProvider]] = {
    "gemini": GeminiProvider,
    "groq": GroqProvider,
}


def get_provider(name: str | None = None) -> AIProvider:
    """Ambil instance provider aktif. Default dibaca dari Settings.ai_provider
    (env AI_PROVIDER) biar bisa diganti per environment tanpa redeploy kode."""
    provider_name = name or get_settings().ai_provider
    provider_cls = _PROVIDERS.get(provider_name)
    if provider_cls is None:
        raise ValueError(f"Provider AI '{provider_name}' belum didukung.")
    return provider_cls()


_TASK_PROVIDER_MAP: dict[str, str] = {
    "vision": "gemini",       # Flash Lite -- Groq gak support vision
    "transcribe": "groq",     # Whisper large v3
}


# Benchmark memaksa satu provider untuk semua fitur di context-nya (app/routers/benchmark.py).
paksa_provider: ContextVar[AIProvider | None] = ContextVar("paksa_provider", default=None)


def get_provider_for_task(task: str) -> AIProvider:
    """Ambil provider terbaik buat task tertentu. Fallback ke default
    provider kalau task gak dikenal."""
    if (paksa := paksa_provider.get()) is not None:
        return paksa
    provider_name = _TASK_PROVIDER_MAP.get(task)
    if provider_name is None:
        return get_provider()
    return get_provider(provider_name)
