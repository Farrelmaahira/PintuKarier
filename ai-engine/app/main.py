"""Entry point AI Engine Pintu Karier.

Menjalankan job ML README 5.5: parse_cv, transcribe, questions, score
(Evidence Based Scoring 5 dimensi), dan draft_feedback. Diadaptasi dari AI engine
direkrut-AI. Aggregate prodi dihitung deterministik di backend Go.

Layanan ini hanya dipanggil backend Go (server-to-server), tidak pernah dari
browser -- trust boundary-nya shared-secret header X-Internal-Api-Key (lihat
app/security.py), dicek di semua router /v1/*.
"""

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI

from app.config import get_settings
from app.errors import register_error_handlers
from app.logging import RequestIDMiddleware, configure_logging
from app.routers import benchmark, draft_feedback, parse_cv, questions, score, transcribe
from app.security import require_internal_key


@asynccontextmanager
async def lifespan(_app: FastAPI):
    configure_logging()
    yield


app = FastAPI(
    title="Pintu Karier - AI Engine",
    description="Layanan internal: parse CV, transkrip interview, evidence based scoring, draf feedback.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(RequestIDMiddleware)
register_error_handlers(app)

_internal_only = [Depends(require_internal_key)]
app.include_router(parse_cv.router, prefix="/v1/parse-cv", tags=["parse_cv"], dependencies=_internal_only)
app.include_router(transcribe.router, prefix="/v1/transcribe", tags=["transcribe"], dependencies=_internal_only)
app.include_router(score.router, prefix="/v1/score", tags=["score"], dependencies=_internal_only)
app.include_router(questions.router, prefix="/v1/questions", tags=["questions"], dependencies=_internal_only)
app.include_router(draft_feedback.router, prefix="/v1/draft-feedback", tags=["draft_feedback"], dependencies=_internal_only)
app.include_router(benchmark.router, prefix="/v1/benchmark", tags=["benchmark"], dependencies=_internal_only)


@app.get("/healthz")
def health_check() -> dict[str, str]:
    """Pure liveness check -- selalu 200 selama proses hidup."""
    return {"status": "ok", "service": "ai-engine"}


@app.get("/readyz")
async def ready_check() -> dict[str, str]:
    settings = get_settings()
    if not settings.internal_api_key or not settings.groq_api_key:
        return {"status": "not_configured"}
    return {"status": "ready"}
