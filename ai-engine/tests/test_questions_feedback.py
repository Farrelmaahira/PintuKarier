"""Tes generator pertanyaan, draf feedback terstruktur, dan decode file tanpa provider asli."""

from __future__ import annotations

import base64
import json

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.files import FileRequest, decode_file
from app.main import app
from app.routers import draft_feedback as fb_module
from app.routers import questions as q_module


class _Fake:
    COMPLETE_MODEL = "fake"

    def __init__(self, raw: str) -> None:
        self.raw = raw

    async def complete(self, prompt: str, *, system: str | None = None, json_mode: bool = False) -> str:
        assert json_mode
        return self.raw


def _post(monkeypatch: pytest.MonkeyPatch, module: object, path: str, raw: str, body: dict):
    monkeypatch.setenv("INTERNAL_API_KEY", "k")
    monkeypatch.setattr(module, "get_provider_for_task", lambda _task: _Fake(raw))
    return TestClient(app).post(path, json=body, headers={"X-Internal-Api-Key": "k"})


QBODY = {"posisi": "QA Intern", "wajib": ["Testing otomatis"], "plus": []}


def test_questions_returns_three_each(monkeypatch: pytest.MonkeyPatch) -> None:
    raw = json.dumps({"prescreen": ["a", "b", "c", "d"], "interview": ["x", "y", "z"]})
    res = _post(monkeypatch, q_module, "/v1/questions", raw, QBODY)
    assert res.status_code == 200, res.text
    assert res.json() == {"prescreen": ["a", "b", "c"], "interview": ["x", "y", "z"]}


def test_questions_falls_back_when_model_short_or_broken(monkeypatch: pytest.MonkeyPatch) -> None:
    res = _post(monkeypatch, q_module, "/v1/questions", json.dumps({"prescreen": ["a"], "interview": "x"}), QBODY)
    assert res.json() == {"prescreen": q_module.FALLBACK_PRESCREEN, "interview": q_module.FALLBACK_INTERVIEW}
    res = _post(monkeypatch, q_module, "/v1/questions", "bukan json", QBODY)
    assert len(res.json()["interview"]) == 3


def test_draft_feedback_structured(monkeypatch: pytest.MonkeyPatch) -> None:
    raw = json.dumps({
        "ringkasan": "Makasih udah melamar.",
        "kekuatan": ["React dipakai di proyek PBL.", ""],
        "area": [{"kompetensi": "Testing otomatis", "kenapa": "Belum ada bukti.", "saran": "Tulis 10 unit test.", "matkul": "karangan"}],
        "penutup": "Semangat!",
    })
    body = {"posisi": "QA Intern", "kategori": "Perlu Pengembangan", "bukti": [{"syarat": "Testing otomatis", "wajib": True, "status": "Tidak ditemukan"}]}
    res = _post(monkeypatch, fb_module, "/v1/draft-feedback", raw, body)
    assert res.status_code == 200, res.text
    out = res.json()
    assert out["kekuatan"] == ["React dipakai di proyek PBL."]
    # Mata kuliah diisi backend dari peta prodi, bukan dari model.
    assert out["area"][0] == {"kompetensi": "Testing otomatis", "kenapa": "Belum ada bukti.", "saran": "Tulis 10 unit test.", "matkul": ""}


def test_draft_feedback_502_on_malformed(monkeypatch: pytest.MonkeyPatch) -> None:
    body = {"posisi": "QA Intern", "kategori": "x", "bukti": []}
    assert _post(monkeypatch, fb_module, "/v1/draft-feedback", "[]", body).status_code == 502


def test_decode_file_validates() -> None:
    ok = FileRequest(file_b64=base64.b64encode(b"%PDF").decode(), filename="cv.pdf")
    assert decode_file(ok) == b"%PDF"
    for bad in ("bukan base64!!", ""):
        with pytest.raises(HTTPException):
            decode_file(FileRequest(file_b64=bad, filename="cv.pdf"))


def test_decode_file_rejects_oversize(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("MAX_FILE_BYTES", "3")
    with pytest.raises(HTTPException) as exc:
        decode_file(FileRequest(file_b64=base64.b64encode(b"1234").decode(), filename="a.webm"))
    assert exc.value.status_code == 413
