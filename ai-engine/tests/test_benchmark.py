"""Benchmark per fitur dengan provider palsu: fitur asli dijalankan, provider dipaksa lewat ContextVar."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routers import benchmark as bm


class _Fake:
    def __init__(self, model: str, raw: str) -> None:
        self.COMPLETE_MODEL = model
        self.raw = raw

    async def complete(self, prompt: str, *, system: str | None = None, json_mode: bool = False) -> str:
        return self.raw


class _Gagal(_Fake):
    async def complete(self, prompt: str, *, system: str | None = None, json_mode: bool = False) -> str:
        raise RuntimeError("provider mati")


def _post(monkeypatch: pytest.MonkeyPatch, providers: list[_Fake]):
    monkeypatch.setenv("INTERNAL_API_KEY", "k")
    monkeypatch.setattr(bm, "_providers", lambda: [lambda p=p: p for p in providers])
    return TestClient(app).post("/v1/benchmark", headers={"X-Internal-Api-Key": "k"})


def test_benchmark_per_fitur(monkeypatch: pytest.MonkeyPatch) -> None:
    res = _post(monkeypatch, [_Fake("rusak", "bukan json"), _Gagal("mati", "")])
    assert res.status_code == 200, res.text
    detik = {(r["fitur"], r["nama"].split(" · ")[-1]): r["detik"] for r in res.json()}
    # Pertanyaan punya fallback; scoring menolak JSON rusak; provider mati gagal di semua fitur.
    assert detik[("Pertanyaan interview", "rusak")] is not None
    assert detik[("Evidence-Based Scoring", "rusak")] is None
    assert all(detik[(f, "mati")] is None for f in bm.MANUAL_DETIK)
    assert detik[("Ekstraksi CV", "Manual (estimasi)")] == 300
    assert [r["fitur"] for r in res.json()][:3] == ["Ekstraksi CV"] * 3


def test_semua_model_gagal_502(monkeypatch: pytest.MonkeyPatch) -> None:
    # 502, bukan daftar kosong: backend tidak boleh menyimpan hasil yang semua modelnya gagal.
    assert _post(monkeypatch, [_Gagal("mati", "")]).status_code == 502
    assert _post(monkeypatch, []).status_code == 502
