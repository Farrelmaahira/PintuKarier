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
    "Kamu sistem ekstraksi CV mahasiswa vokasi resmi untuk kampus. "
    "Tugasmu mengekstrak data profil lengkap, keahlian, dan seluruh sertifikasi/penghargaan dari teks CV.\n"
    "Balas HANYA dengan objek JSON valid dengan struktur persis berikut:\n"
    "{\n"
    '  "ringkasan": string (1-2 kalimat ringkasan profesional fokus keahlian),\n'
    '  "skill": [string] (daftar keahlian teknis),\n'
    f'  "pengalaman": [{_ITEM_SHAPE}] (riwayat kerja/magang),\n'
    f'  "proyek": [{_ITEM_SHAPE}] (proyek kuliah, PBL, open-source SDK, aplikasi personal),\n'
    f'  "organisasi": [{_ITEM_SHAPE}] (himpunan, kepanitiaan, komunitas),\n'
    '  "sertifikasi": [string] (WAJIB masukkan setiap sertifikasi, lisensi, kompetensi, serta PENGHARGAAN / JUARA / AWARDS / GRANTEE yang tertulis di CV, misal: Juara 1 KMIPN, Stellar Instawards Grantee, Sertifikat BNSP, dll),\n'
    '  "identitas": {\n'
    '    "nim": string,\n'
    '    "kampus": string,\n'
    '    "semester": number|null,\n'
    '    "ipk": number|null\n'
    '  }\n'
    "}\n"
    "PENTING: JANGAN mengosongkan array 'sertifikasi' jika pada teks CV terdapat bagian PENGHARGAAN, AWARDS, SERTIFIKAT, atau GRANTEE. Masukkan judul penghargaan tersebut ke dalam array sertifikasi.\n"
    "Field yang benar-benar tidak tertulis dikosongkan (\"\" atau []). JANGAN mengarang data identitas pribadi selain yang tertulis.\n\n"
    + INJECTION_GUARD
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


def _extract_fallback_sertifikasi(teks: str) -> list[str]:
    """Fallback scanner jika LLM melewatkan bagian sertifikasi/penghargaan."""
    res: list[str] = []
    match = re.search(r'(?:PENGHARGAAN|SERTIFIKASI|AWARDS?|PRESTASI|LISENSI)\s*([\s\S]*?)(?:PENDIDIKAN|KEAHLIAN|BAHASA|PENGALAMAN|PROYEK|$)', teks, re.I)
    if match:
        section = match.group(1).strip()
        items = re.split(r'[\n\r]*[●•\-\*]\s*', section)
        for it in items:
            cleaned = ' '.join(it.split()).strip(' .-,')
            if cleaned and len(cleaned) > 3 and not re.match(r'^(?:PENDIDIKAN|KEAHLIAN|BAHASA)', cleaned, re.I):
                res.append(cleaned)
    return res


def _parse_profil(raw: str, teks_cv: str = "") -> tuple[Profil, Identitas, str]:
    """Balikin (profil, identitas, teks dari model). JSON rusak -> profil kosong, bukan 500,
    supaya mahasiswa tetap bisa mengisi profil manual di langkah cek profil."""
    try:
        data = json.loads(raw)
        if not isinstance(data, dict):
            raise TypeError("bukan objek")
        extracted_sertifikasi = [str(s).strip() for s in data.get("sertifikasi") or [] if str(s).strip()]
        if teks_cv:
            fallback = _extract_fallback_sertifikasi(teks_cv)
            for f in fallback:
                if not any(f.lower() in s.lower() or s.lower() in f.lower() for s in extracted_sertifikasi):
                    extracted_sertifikasi.append(f)

        profil = Profil(
            ringkasan=str(data.get("ringkasan") or ""),
            skill=[str(s) for s in data.get("skill") or []],
            pengalaman=_items(data, "pengalaman"),
            proyek=_items(data, "proyek"),
            organisasi=_items(data, "organisasi"),
            sertifikasi=extracted_sertifikasi,
        )
        return profil, _identitas(data), str(data.get("teks") or "")
    except (json.JSONDecodeError, TypeError, AttributeError, ValueError):
        fallback = _extract_fallback_sertifikasi(teks_cv) if teks_cv else []
        return Profil(sertifikasi=fallback), Identitas(), ""


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
        profil, identitas, _ = _parse_profil(result, teks_cv=teks)
        provider_name, model_name = "default", provider.COMPLETE_MODEL
    else:
        raise HTTPException(status_code=422, detail=f"format file '{ext or '(tanpa ekstensi)'}' belum didukung, hanya PDF dan foto")

    log_ai_call(provider=provider_name, model=model_name, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)
    return ParseCVResponse(profil=profil, identitas=_ground_identitas(identitas, teks), teks=teks)


@router.post("", response_model=ParseCVResponse)
async def parse_cv(payload: FileRequest) -> ParseCVResponse:
    return await _compute(decode_file(payload), extension(payload.filename))
