"""File kandidat dikirim backend Go sebagai base64 di body JSON.

Backend sudah memvalidasi tipe dan ukuran saat upload; di sini dicek lagi
karena engine tidak percaya input apa pun (README 7, Back End do).
"""

from __future__ import annotations

import base64
import binascii

from fastapi import HTTPException
from pydantic import BaseModel, Field

from app.config import get_settings

# base64 membengkakkan ukuran 4/3; batas ini sedikit di atas 5 MB setelah encode.
_MAX_B64_CHARS = 7_200_000


class FileRequest(BaseModel):
    file_b64: str = Field(max_length=_MAX_B64_CHARS)
    filename: str = Field(max_length=200)


def decode_file(payload: FileRequest) -> bytes:
    try:
        raw = base64.b64decode(payload.file_b64, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise HTTPException(status_code=422, detail="file bukan base64 yang valid") from exc
    if not raw:
        raise HTTPException(status_code=422, detail="file kosong")
    if len(raw) > get_settings().max_file_bytes:
        raise HTTPException(status_code=413, detail="ukuran file melebihi batas 5 MB")
    return raw


def extension(filename: str) -> str:
    return "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
