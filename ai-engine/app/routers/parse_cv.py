"""Job parse_cv: CV (PDF atau foto) -> profil terstruktur + teks verbatim.

Bentuk profil mengikuti CvProfile di frontend/lib/data/student.ts; identitas akademik
dipakai Go untuk melengkapi profil akun mahasiswa. Teks verbatim
dikembalikan supaya scoring bisa mengutip CV asli, bukan ringkasan buatan LLM.

  - PDF  -> ekstrak teks (pypdf) -> provider completion
  - foto (jpg/png/webp) -> Gemini vision, sekaligus transkripsi teks (OCR)
PDF hasil scan tanpa teks dibalas 422 yang jelas (rasterisasi di luar scope).
"""

from __future__ import annotations

import io
import json
import re
import time

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from pypdf import PdfReader
from pypdf.errors import PdfReadError

from app.files import FileRequest, decode_file, extension
from app.logging import log_ai_call
from app.prompt_guard import INJECTION_GUARD, wrap_untrusted
from app.providers import GeminiProvider, get_provider_for_task
from app.routers.score import _norm

router = APIRouter()

PROMPT_VERSION = "parse-cv-v3"

_IMAGE_MIME_BY_EXTENSION = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}

_ITEM_SHAPE = '{"peran": string, "tempat": string, "waktu": string, "poin": string}'

_EXTRACTION_SYSTEM_PROMPT = (
    "Kamu mengekstrak profil terstruktur dari CV mahasiswa untuk layanan karier kampus. "
    "Balas HANYA dengan JSON valid berbentuk: "
    '{"ringkasan": string, "skill": [string], '
    f'"pengalaman": [{_ITEM_SHAPE}], "proyek": [{_ITEM_SHAPE}], "organisasi": [{_ITEM_SHAPE}], '
    '"sertifikasi": [string], '
    '"identitas": {"nim": string, "kampus": string, "semester": number|null, "ipk": number|null}}. '
    "Aturan: pengalaman = magang dan kerja; proyek = proyek kuliah, PBL, tugas akhir, proyek pribadi; "
    "organisasi = himpunan, UKM, kepanitiaan; poin = satu kalimat hasil atau tanggung jawab paling konkret "
    "apa adanya dari CV; waktu ditulis apa adanya dari CV; ringkasan 1-2 kalimat netral tentang fokus "
    "keahlian ditulis dalam Bahasa Indonesia. Urutkan dari yang terbaru. "
    "identitas: kampus = nama perguruan tinggi yang sedang ditempuh, ditulis persis seperti di CV; "
    "nim, semester, dan ipk (skala 4) diisi hanya bila tertulis eksplisit di CV. JANGAN ekstrak umur, jenis kelamin, agama, alamat, atau nomor "
    "telepon. Field yang tidak tertulis di CV dikosongkan (\"\" atau []) -- JANGAN mengarang."
    "\n\n" + INJECTION_GUARD
)

# Foto tidak punya teks yang bisa diekstrak, jadi model juga diminta menyalin isinya.
_IMAGE_SYSTEM_PROMPT = (
    _EXTRACTION_SYSTEM_PROMPT
    + '\n\nTambahkan juga field "teks": salinan verbatim seluruh tulisan yang terbaca di gambar CV.'
)


class ProfilItem(BaseModel):
    peran: str = ""
    tempat: str = ""
    waktu: str = ""
    poin: str = ""


class Profil(BaseModel):
    ringkasan: str = ""
    skill: list[str] = Field(default_factory=list)
    pengalaman: list[ProfilItem] = Field(default_factory=list)
    proyek: list[ProfilItem] = Field(default_factory=list)
    organisasi: list[ProfilItem] = Field(default_factory=list)
    sertifikasi: list[str] = Field(default_factory=list)


class Identitas(BaseModel):
    nim: str = ""
    kampus: str = ""
    semester: int = 0
    ipk: float = 0


class ParseCVResponse(BaseModel):
    profil: Profil
    identitas: Identitas = Field(default_factory=Identitas)
    teks: str


def _extract_pdf_text(raw: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(raw))
        return "\n".join(page.extract_text() or "" for page in reader.pages).strip()
    except PdfReadError as exc:
        raise HTTPException(status_code=422, detail="PDF tidak bisa dibaca (kemungkinan rusak), coba unggah ulang") from exc


def _items(data: dict, key: str) -> list[ProfilItem]:
    return [ProfilItem(**{k: str(v or "") for k, v in item.items() if k in ProfilItem.model_fields}) for item in data.get(key) or [] if isinstance(item, dict)]


def _angka(value: object, hi: float) -> float:
    """Angka dari model ("3,75", "6", null); di luar 0..hi dianggap tidak tertulis."""
    try:
        n = float(str(value).replace(",", "."))
    except ValueError:
        return 0
    return n if 0 <= n <= hi else 0


def _identitas(data: dict) -> Identitas:
    raw = data.get("identitas")
    if not isinstance(raw, dict):
        return Identitas()
    return Identitas(
        nim=str(raw.get("nim") or "").strip(),
        kampus=str(raw.get("kampus") or "").strip(),
        semester=int(_angka(raw.get("semester"), 14)),
        ipk=_angka(raw.get("ipk"), 4),
    )


def _ground_identitas(identitas: Identitas, teks: str) -> Identitas:
    """Buang isian yang tidak tertulis di teks CV, supaya NIM, kampus, atau IPK karangan model tidak masuk profil."""
    # Dibatasi spasi supaya potongan nomor HP tidak dianggap NIM.
    norm = f" {_norm(teks)} "

    def tertulis(nilai: str) -> str:
        n = _norm(nilai)
        return nilai if n and f" {n} " in norm else ""

    titik = re.sub(r"(\d),(\d)", r"\1.\2", teks)
    ipk = re.escape(f"{identitas.ipk:g}")
    return Identitas(
        nim=tertulis(identitas.nim),
        kampus=tertulis(identitas.kampus),
        semester=identitas.semester if identitas.semester and re.search(rf"semester\s*{identitas.semester}\b", teks, re.I) else 0,
        ipk=identitas.ipk if identitas.ipk and re.search(rf"(?<![\d.]){ipk}0*(?!\d)", titik) else 0,
    )


def _parse_profil(raw: str) -> tuple[Profil, Identitas, str]:
    """Balikin (profil, identitas, teks dari model). JSON rusak -> profil kosong, bukan 500,
    supaya mahasiswa tetap bisa mengisi profil manual di langkah cek profil."""
    try:
        data = json.loads(raw)
        if not isinstance(data, dict):
            raise TypeError("bukan objek")
        profil = Profil(
            ringkasan=str(data.get("ringkasan") or ""),
            skill=[str(s) for s in data.get("skill") or []],
            pengalaman=_items(data, "pengalaman"),
            proyek=_items(data, "proyek"),
            organisasi=_items(data, "organisasi"),
            sertifikasi=[str(s) for s in data.get("sertifikasi") or []],
        )
        return profil, _identitas(data), str(data.get("teks") or "")
    except (json.JSONDecodeError, TypeError, AttributeError, ValueError):
        return Profil(), Identitas(), ""


async def _compute(raw_bytes: bytes, ext: str) -> ParseCVResponse:
    started = time.monotonic()

    if ext in _IMAGE_MIME_BY_EXTENSION:
        gemini = GeminiProvider()
        result = await gemini.complete(
            "Ekstrak profil dan salin teks CV dari gambar ini.",
            system=_IMAGE_SYSTEM_PROMPT,
            json_mode=True,
            image_bytes=raw_bytes,
            image_mime_type=_IMAGE_MIME_BY_EXTENSION[ext],
        )
        profil, identitas, teks = _parse_profil(result)
        provider_name, model_name = "gemini", gemini.COMPLETE_MODEL
    elif ext == ".pdf":
        teks = _extract_pdf_text(raw_bytes)
        if not teks:
            raise HTTPException(status_code=422, detail="PDF tidak punya teks yang bisa dibaca (kemungkinan hasil scan), unggah sebagai foto")
        provider = get_provider_for_task("complete")
        result = await provider.complete(wrap_untrusted("ISI_CV", teks), system=_EXTRACTION_SYSTEM_PROMPT, json_mode=True)
        profil, identitas, _ = _parse_profil(result)
        provider_name, model_name = "default", provider.COMPLETE_MODEL
    else:
        raise HTTPException(status_code=422, detail=f"format file '{ext or '(tanpa ekstensi)'}' belum didukung, hanya PDF dan foto")

    log_ai_call(provider=provider_name, model=model_name, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)
    return ParseCVResponse(profil=profil, identitas=_ground_identitas(identitas, teks), teks=teks)


@router.post("", response_model=ParseCVResponse)
async def parse_cv(payload: FileRequest) -> ParseCVResponse:
    return await _compute(decode_file(payload), extension(payload.filename))
