"""Job score: Evidence Based Scoring Pintu Karier (Tabel 1 concept paper).

Diadaptasi dari mesin evidence direkrut-AI: LLM HANYA mengklasifikasi bukti
per syarat, angka dihitung deterministik di Python dari faktor yang dipilih
LLM. Bobot total dan kategori kelulusan TIDAK dihitung di sini -- itu aturan
domain di backend Go (domain.CategoryForScore), satu sumber kebenaran.

Penyesuaian untuk Pintu Karier:
  - Sumber bukti tiga: CV, Pre-screening, AI Interview (README 5.5).
  - Lima dimensi selalu terisi: tiap dimensi punya satu syarat "probe".
  - Magang, proyek, organisasi, portofolio sah sebagai pengalaman.
  - Grounding: kutipan wajib ada di sumbernya; kutipan karangan model dibuang
    dan statusnya turun ke "Tidak ditemukan". Tidak ada skor tanpa bukti.
  - Teks yang menyerupai instruksi ke AI ditandai ke HR dengan teks persisnya.
"""

from __future__ import annotations

import json
import re
import time
from difflib import SequenceMatcher

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import get_settings
from app.logging import log_ai_call
from app.prompt_guard import INJECTION_GUARD, find_prompt_attack, wrap_untrusted
from app.providers import get_provider_for_task

router = APIRouter()

# Naikkan setiap prompt, taksonomi, atau aturan skor berubah, lalu catat hasil evaluasinya.
PROMPT_VERSION = "score-v2"

SOURCES = ("CV", "Pre-screening", "AI Interview")

# Urutan sama dengan DIMENSI di lib/data/scoring.ts.
_DIM_BY_CATEGORY = {
    "SKILL": 0,
    "EXPERIENCE": 1,
    "RESPONSIBILITY": 2,
    "EDUCATION": 3,
    "CERTIFICATION": 3,
    "ADDITIONAL": 4,
}

STATUS_TERPENUHI = "Terpenuhi"
STATUS_SEBAGIAN = "Sebagian"
STATUS_TIDAK = "Tidak ditemukan"


# ─── Kontrak ─────────────────────────────────────────────────────────────────

class QA(BaseModel):
    tanya: str = ""
    jawab: str = ""


class ScoreRequest(BaseModel):
    posisi: str
    deskripsi: str = ""
    wajib: list[str]
    plus: list[str] = Field(default_factory=list)
    cv_teks: str
    prescreening: list[QA] = Field(default_factory=list)
    interview: list[QA] = Field(default_factory=list)


class Bukti(BaseModel):
    syarat: str
    wajib: bool
    # dasar: probe per dimensi, bukan syarat lowongan; tidak ikut agregat prodi.
    dasar: bool = False
    dimensi: int
    status: str
    kutipan: str | None = None
    sumber: str | None = None
    alasan: str = ""


class ScoreResponse(BaseModel):
    dimensi: list[float]
    bukti: list[Bukti]
    alasan: str
    peringatan: str | None = None
    versi: str


class _Req(BaseModel):
    id: str
    requirement: str
    importance: str  # REQUIRED (wajib) | PREFERRED (plus dan probe)
    category: str | None = None  # None = ditentukan LLM


# ─── Prompt ──────────────────────────────────────────────────────────────────

_SYSTEM_PROMPT = """Kamu membantu HR mitra kampus menyaring pelamar magang dan fresh graduate. Tugasmu HANYA mengekstrak dan mengklasifikasi bukti dari dokumen kandidat untuk setiap syarat. JANGAN menghitung atau menulis skor angka.

Kamu menerima DAFTAR_SYARAT (JSON) dan tiga sumber bukti: CV, PRESCREENING (jawaban pre-screening), dan INTERVIEW (transkrip AI Interview).

Untuk SETIAP syarat di DAFTAR_SYARAT keluarkan tepat satu assessment:
- "id": id syarat persis dari input.
- "category": pakai category dari input jika ada; jika null tentukan salah satu: SKILL | EXPERIENCE | RESPONSIBILITY | EDUCATION | CERTIFICATION | ADDITIONAL.
- "match_status": "MATCHED" (bukti mendukung penuh) | "PARTIAL_MATCH" (bukti sebagian atau serumpun) | "NO_EVIDENCE".
- "evidence_text": kutipan VERBATIM, disalin persis (maksimal 2 kalimat) dari satu sumber; null jika NO_EVIDENCE.
- "source": "CV" | "Pre-screening" | "AI Interview" sesuai asal kutipan; null jika NO_EVIDENCE.
- "reasoning": satu kalimat netral tentang buktinya, bukan penilaian atas pribadi kandidat.
- "dimension_factors": isi sesuai category, key lain diabaikan:
  - SKILL: "skill_usage_level" (MENTION_ONLY, CONTEXTUAL_USAGE, PROJECT_USAGE, PROFESSIONAL_USAGE, ADVANCED_PRODUCTION_USAGE)
  - EXPERIENCE: "experience_relevance" (DIRECT_ROLE, RELATED_ROLE, ADJACENT_ROLE, UNRELATED_ROLE)
  - RESPONSIBILITY: "responsibility_scope" (INDIVIDUAL_TASK, PROJECT_CONTRIBUTOR, PROJECT_OWNER, TEAM_LEAD, ORGANIZATIONAL_SCOPE), "ownership_level" (LOW, MEDIUM, HIGH)
  - EDUCATION: "education_match" (EXACT_MATCH, RELATED_FIELD, DIFFERENT_FIELD, LOWER_LEVEL, NO_EVIDENCE)
  - CERTIFICATION: "certification_status" (VERIFIED_IN_CV, MENTIONED_ONLY, NOT_FOUND)
  - ADDITIONAL: "additional_evidence_type" (PORTFOLIO, LEADERSHIP, ORGANIZATION, LANGUAGE, AWARD, VOLUNTEER, SIDE_PROJECT, OTHER)

ATURAN:
- Kandidat adalah mahasiswa atau fresh graduate. Magang, proyek kuliah, PBL, proyek tim, organisasi, kepanitiaan, dan portofolio adalah bukti pengalaman dan tanggung jawab yang sah. Jangan menurunkan klasifikasi hanya karena tidak ada pengalaman kerja penuh waktu.
- Nama berbeda untuk hal yang sama dianggap cocok (ReactJS = React, pengujian otomatis = automated testing).
- Hanya kutip teks yang benar-benar ada di sumber. Kutipan yang tidak ada di sumber akan dibuang sistem.
- Jika tidak ada bukti: match_status NO_EVIDENCE, evidence_text null, source null, reasoning "Bukti untuk syarat ini tidak ditemukan."

Balas HANYA dengan JSON valid:
{"assessments": [{"id": "R1", "category": "SKILL", "match_status": "MATCHED", "evidence_text": "...", "source": "CV", "reasoning": "...", "dimension_factors": {"skill_usage_level": "PROJECT_USAGE"}}], "ringkasan": "2-3 kalimat rangkuman kecocokan berbasis bukti dalam Bahasa Indonesia, sebut NAMA syarat wajib yang belum punya bukti (jangan tulis id seperti W1, P2, atau D1)."}

""" + INJECTION_GUARD


def build_requirements(payload: ScoreRequest) -> list[_Req]:
    reqs = [_Req(id=f"W{i + 1}", requirement=s, importance="REQUIRED") for i, s in enumerate(payload.wajib)]
    reqs += [_Req(id=f"P{i + 1}", requirement=s, importance="PREFERRED") for i, s in enumerate(payload.plus)]
    # Probe per dimensi: lima dimensi selalu punya bukti yang dinilai,
    # walau HR cuma menulis syarat skill.
    probes = [
        ("SKILL", f"Skill teknis yang relevan untuk posisi {payload.posisi}"),
        ("EXPERIENCE", f"Pengalaman magang, kerja, atau proyek yang relevan dengan {payload.posisi}"),
        ("RESPONSIBILITY", "Peran dan tanggung jawab yang pernah dipegang di proyek, magang, atau organisasi"),
        ("EDUCATION", "Jurusan, mata kuliah, atau sertifikasi yang relevan"),
        ("ADDITIONAL", "Prestasi, organisasi, atau portofolio"),
    ]
    reqs += [_Req(id=f"D{i + 1}", requirement=r, importance="PREFERRED", category=c) for i, (c, r) in enumerate(probes)]
    return reqs


def _qa_text(items: list[QA]) -> str:
    return "\n\n".join(f"T: {q.tanya}\nJ: {q.jawab}" for q in items) or "(kosong)"


def build_prompt(payload: ScoreRequest, reqs: list[_Req]) -> str:
    return "\n\n".join(
        [
            f"POSISI: {payload.posisi}",
            wrap_untrusted("DESKRIPSI_LOWONGAN", payload.deskripsi or "(tidak ada)"),
            "DAFTAR_SYARAT:\n" + json.dumps([r.model_dump() for r in reqs], ensure_ascii=False),
            wrap_untrusted("CV", payload.cv_teks),
            wrap_untrusted("PRESCREENING", _qa_text(payload.prescreening)),
            wrap_untrusted("INTERVIEW", _qa_text(payload.interview)),
        ]
    )


# ─── Skor deterministik (dari direkrut-AI) ──────────────────────────────────

def _get_skill_score(level: str | None) -> float:
    return {"ADVANCED_PRODUCTION_USAGE": 100.0, "PROFESSIONAL_USAGE": 90.0, "PROJECT_USAGE": 75.0, "CONTEXTUAL_USAGE": 50.0, "MENTION_ONLY": 20.0}.get(level or "", 0.0)


def _get_experience_score(relevance: str | None) -> float:
    # Lowongan Pintu Karier tidak punya syarat durasi, jadi relevansi saja.
    return {"DIRECT_ROLE": 100.0, "RELATED_ROLE": 70.0, "ADJACENT_ROLE": 40.0}.get(relevance or "", 0.0)


def _get_responsibility_score(scope: str | None, ownership: str | None) -> float:
    base = {"ORGANIZATIONAL_SCOPE": 100.0, "TEAM_LEAD": 95.0, "PROJECT_OWNER": 80.0, "PROJECT_CONTRIBUTOR": 60.0, "INDIVIDUAL_TASK": 40.0}.get(scope or "", 0.0)
    return base * {"HIGH": 1.0, "MEDIUM": 0.9, "LOW": 0.8}.get(ownership or "", 1.0)


def _get_education_score(match_level: str | None) -> float:
    return {"EXACT_MATCH": 100.0, "RELATED_FIELD": 80.0, "DIFFERENT_FIELD": 40.0, "LOWER_LEVEL": 20.0}.get(match_level or "", 0.0)


def _get_certification_score(status: str | None) -> float:
    return {"VERIFIED_IN_CV": 100.0, "MENTIONED_ONLY": 50.0}.get(status or "", 0.0)


def _get_additional_score(ev_type: str | None) -> float:
    if ev_type in ("PORTFOLIO", "AWARD", "LEADERSHIP"):
        return 90.0
    if ev_type in ("SIDE_PROJECT", "ORGANIZATION"):
        return 75.0
    if ev_type in ("LANGUAGE", "VOLUNTEER", "OTHER"):
        return 60.0
    return 50.0


# Dipakai kalau model lupa mengisi faktor: bukti tetap ada, jadi jangan jadi nol.
_FALLBACK_BY_STATUS = {STATUS_TERPENUHI: 70.0, STATUS_SEBAGIAN: 40.0}


def factor_score(category: str, factors: dict) -> float:
    if category == "SKILL":
        return _get_skill_score(factors.get("skill_usage_level"))
    if category == "EXPERIENCE":
        return _get_experience_score(factors.get("experience_relevance"))
    if category == "RESPONSIBILITY":
        return _get_responsibility_score(factors.get("responsibility_scope"), factors.get("ownership_level"))
    if category == "EDUCATION":
        return _get_education_score(factors.get("education_match"))
    if category == "CERTIFICATION":
        return _get_certification_score(factors.get("certification_status"))
    return _get_additional_score(factors.get("additional_evidence_type"))


# ─── Grounding ───────────────────────────────────────────────────────────────

def _norm(text: str) -> str:
    return " ".join(re.sub(r"[^\w]+", " ", text.lower()).split())


def is_grounded(quote: str, source_text: str) -> bool:
    """Kutipan dianggap ada di sumber kalau sama persis setelah normalisasi,
    atau blok berurutan terpanjangnya mencakup >= 80% kutipan (toleransi
    salah ketik kecil dari model, bukan parafrase)."""
    q, s = _norm(quote), _norm(source_text)
    if not q or not s:
        return False
    if q in s:
        return True
    m = SequenceMatcher(None, q, s, autojunk=False).find_longest_match(0, len(q), 0, len(s))
    return m.size >= 0.8 * len(q)


def ground(quote: str, source_text: str) -> str | None:
    """Kutipan verbatim untuk ditampilkan ke HR. Kutipan model yang persis ada di sumber (beda spasi atau
    tanda baca saja) dipakai apa adanya; selain itu pakai potongan sumber yang cocok selama cukup panjang
    (>= 20 huruf dan >= separuh kutipan). Teks karangan model tidak pernah tampil sebagai bukti."""
    q_norm = _norm(quote)
    if q_norm and q_norm in _norm(source_text):
        return quote
    q, src = quote.lower(), source_text.lower()
    m = SequenceMatcher(None, q, src, autojunk=False).find_longest_match(0, len(q), 0, len(src))
    if m.size >= max(20, 0.5 * len(q.strip())):
        return source_text[m.b : m.b + m.size].strip()
    return None


def locate_source(quote: str, claimed: str | None, sources: dict[str, str]) -> tuple[str, str] | None:
    """(sumber, kutipan verbatim) tempat kutipan benar-benar ada, utamakan sumber yang diklaim model."""
    order = ([claimed] if claimed in sources else []) + [s for s in SOURCES if s != claimed]
    for name in order:
        verbatim = ground(quote, sources[name])
        if verbatim:
            return name, verbatim
    return None


# ─── Pasca-proses ────────────────────────────────────────────────────────────

def _status(match_status: str) -> str:
    return {"MATCHED": STATUS_TERPENUHI, "PARTIAL_MATCH": STATUS_SEBAGIAN}.get(match_status, STATUS_TIDAK)


def assemble(payload: ScoreRequest, reqs: list[_Req], data: dict) -> tuple[list[float], list[Bukti]]:
    """Ubah klasifikasi LLM jadi bukti tervalidasi + lima skor dimensi."""
    sources = {
        "CV": payload.cv_teks,
        "Pre-screening": "\n".join(q.jawab for q in payload.prescreening),
        "AI Interview": "\n".join(q.jawab for q in payload.interview),
    }
    by_id = {str(a.get("id")): a for a in data.get("assessments", []) if isinstance(a, dict)}

    bukti: list[Bukti] = []
    scored: list[tuple[int, str, float]] = []  # (dimensi, importance, skor)
    for r in reqs:
        a = by_id.get(r.id, {})
        category = r.category or str(a.get("category") or "SKILL").upper()
        if category not in _DIM_BY_CATEGORY:
            category = "SKILL"
        status = _status(str(a.get("match_status") or "").upper())
        quote = a.get("evidence_text") or None
        reason = str(a.get("reasoning") or "")
        source = None
        if status != STATUS_TIDAK:
            found = locate_source(str(quote or ""), a.get("source"), sources)
            if found:
                source, quote = found
            else:
                status = STATUS_TIDAK
                reason = "Kutipan dari model tidak ditemukan di dokumen kandidat, jadi tidak dihitung sebagai bukti."
        if status == STATUS_TIDAK:
            quote = None
            reason = reason or "Bukti untuk syarat ini tidak ditemukan."
            score = 0.0
        else:
            factors = a.get("dimension_factors")
            score = factor_score(category, factors if isinstance(factors, dict) else {}) or _FALLBACK_BY_STATUS[status]

        dim = _DIM_BY_CATEGORY[category]
        scored.append((dim, r.importance, score))
        bukti.append(Bukti(syarat=r.requirement, wajib=r.importance == "REQUIRED", dasar=r.category is not None, dimensi=dim, status=status, kutipan=quote, sumber=source, alasan=reason))

    dims: list[float] = []
    for d in range(5):
        req = [s for dim, imp, s in scored if dim == d and imp == "REQUIRED"]
        pref = [s for dim, imp, s in scored if dim == d and imp == "PREFERRED"]
        if req and pref:
            value = (sum(req) / len(req)) * 0.8 + (sum(pref) / len(pref)) * 0.2
        elif req or pref:
            value = sum(req or pref) / len(req or pref)
        else:
            value = 0.0
        dims.append(round(value, 1))
    return dims, bukti


def detect_injection(payload: ScoreRequest) -> str | None:
    checks = [("CV", payload.cv_teks)]
    checks += [("jawaban pre-screening", q.jawab) for q in payload.prescreening]
    checks += [("jawaban AI Interview", q.jawab) for q in payload.interview]
    for where, text in checks:
        found = find_prompt_attack(text)
        if found:
            return f'Ditemukan teks yang menyerupai instruksi ke AI di {where}: "{found}" Instruksi ini tidak dipakai dalam penilaian.'
    return None


@router.post("", response_model=ScoreResponse)
async def score(payload: ScoreRequest) -> ScoreResponse:
    provider = get_provider_for_task("complete")
    versi = f"{PROMPT_VERSION}/{get_settings().ai_provider}:{provider.COMPLETE_MODEL}"
    reqs = build_requirements(payload)
    started = time.monotonic()
    raw = await provider.complete(build_prompt(payload, reqs), system=_SYSTEM_PROMPT, json_mode=True)
    log_ai_call(provider="default", model=provider.COMPLETE_MODEL, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)
    try:
        data = json.loads(raw)
        if not isinstance(data, dict) or not isinstance(data.get("assessments"), list):
            raise ValueError("assessments hilang")
    except (json.JSONDecodeError, ValueError) as exc:
        # 502 (bukan skor nol) supaya backend retry; skor nol palsu = kandidat dirugikan.
        raise HTTPException(status_code=502, detail="model mengembalikan format penilaian yang tidak valid") from exc

    dims, bukti = assemble(payload, reqs, data)
    return ScoreResponse(dimensi=dims, bukti=bukti, alasan=str(data.get("ringkasan") or ""), peringatan=detect_injection(payload), versi=versi)
