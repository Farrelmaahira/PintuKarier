# Graph Report - PintuKarier  (2026-11-06)

## Corpus Check
- 414 files · ~208,860 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1870 nodes · 4682 edges · 103 communities (95 shown, 8 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 261 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d9c7b044`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ApplicationRow.tsx
- score.py
- Button.tsx
- devDependencies
- benchmark.py
- Store
- ProfileReview.tsx
- Deps
- main.py
- StudentReadinessClient.tsx
- Badge.tsx
- admin/data.ts
- Panel.tsx
- StudyProgramOverview.tsx
- draft_feedback.py
- api
- compilerOptions
- AdminOverview.tsx
- ImpactSection.tsx
- CvUpload.tsx
- test_questions_feedback.py
- parse_cv.py
- Vacancy
- (site)/page.tsx
- domain_test.go
- testStore
- StudentLearningHubClient.tsx
- [kode]/page.tsx
- InterviewRoom.tsx
- looks_like_prompt_attack
- BuildScore
- autoCorrector.ts
- RoleProfileSection.tsx
- Role
- models.go
- AdminPartnersView.tsx
- Faq.tsx
- ports.go
- Pipeline
- PageHeader.tsx
- context.Context
- BarChart.tsx
- gsap.ts
- Motion.tsx
- useUserBadge.ts
- login.ts
- intro.ts
- ModelBenchmark
- ClaimEvidence
- student.ts
- LoginPanel.tsx
- PracticeSetupPanel.tsx
- main
- ReadinessProfile
- testing.T
- (site)/layout.tsx
- ProblemSection.tsx
- test_benchmark.py
- InterviewVideo.tsx
- pull_request_template.md
- SeedProduction
- TestFullFlow
- CorrectCategory
- useInterviewTranscript.ts
- schema.sql
- learning.go
- FilterRanking
- _with_timeout_and_retry
- useLoaderIntro.ts
- gridCanvas.ts
- useInterviewVoice.ts
- interviewPractice.ts
- .AdminJurusan
- RolesSection.tsx
- auth.ts
- test_security.py
- Backend Pintu Karier
- Permohonan Pull Request: Integrasi Learning Hub & Interactive Competency Drills
- feedback/page.tsx
- app/layout.tsx
- time.Time
- tts/route.ts
- Pintu Karier
- conftest.py
- TestNotFoundJSON
- proxy.ts
- transcribe_audio.py
- transcribe/route.ts
- InterviewVoiceControls.tsx
- eslint.config.mjs
- next.config.ts
- pintukarier-backend
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `api()` - 62 edges
2. `Deps` - 57 edges
3. `Panel()` - 50 edges
4. `Button()` - 41 edges
5. `WriteJSON()` - 40 edges
6. `fail()` - 37 edges
7. `Store` - 35 edges
8. `WriteError()` - 33 edges
9. `attempt()` - 31 edges
10. `ClaimsFromContext()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `parse_cv()` --uses--> `FileRequest`  [INFERRED]
  ai-engine/app/routers/parse_cv.py → ai-engine/app/files.py
- `TestNotFoundJSON()` --calls--> `NewRouter()`  [INFERRED]
  backend/internal/adapter/http/dto_test.go → backend/internal/adapter/http/router.go
- `HandleInterviewDone()` --calls--> `TranscribeRef()`  [EXTRACTED]
  backend/internal/adapter/http/handlers/handlers_application.go → backend/internal/usecase/pipeline.go
- `HandleLamaranFeedback()` --calls--> `feedbackOf()`  [INFERRED]
  backend/internal/adapter/http/handlers/handlers_application.go → backend/internal/adapter/http/handlers/handlers_candidate.go
- `HandleMyFeedback()` --calls--> `feedbackOf()`  [INFERRED]
  backend/internal/adapter/http/handlers/handlers_application.go → backend/internal/adapter/http/handlers/handlers_candidate.go

## Import Cycles
- None detected.

## Communities (103 total, 8 thin omitted)

### Community 0 - "ApplicationRow.tsx"
Cohesion: 0.08
Nodes (30): ACTION_BY_STATUS, ApplicationRow(), ApplicationRowProps, ChipList(), ChipListProps, EmptyState(), EmptyStateProps, Pagination() (+22 more)

### Community 1 - "score.py"
Cohesion: 0.09
Nodes (44): assemble(), build_prompt(), build_requirements(), Bukti, detect_injection(), factor_score(), _get_additional_score(), _get_certification_score() (+36 more)

### Community 2 - "Button.tsx"
Cohesion: 0.13
Nodes (19): DashboardErrorProps, Button(), ButtonProps, DecisionSentPanelProps, Field(), FieldProps, ICON, Notice() (+11 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (43): eslint, eslint-config-next, dependencies, gsap, @gsap/react, lenis, next, @phosphor-icons/react (+35 more)

### Community 4 - "benchmark.py"
Cohesion: 0.08
Nodes (39): ABC, get_settings(), Config typed dari env var, di-load sekali di startup lewat pydantic-settings., Settings, decode_file(), FileRequest, BaseModel, File kandidat dikirim backend Go sebagai base64 di body JSON. Backend sudah… (+31 more)

### Community 5 - "Store"
Cohesion: 0.07
Nodes (31): collect(), evidencesToJSON(), Store, T, nonNil(), notFound(), Open(), scanApp() (+23 more)

### Community 6 - "ProfileReview.tsx"
Cohesion: 0.11
Nodes (24): ProfileEntryList(), ProfileEntryListProps, SkillEditor(), SkillEditorProps, AcademicDataForm(), AcademicDataFormProps, ClaimEvidenceSection(), ClaimEvidenceSectionProps (+16 more)

### Community 7 - "Deps"
Cohesion: 0.05
Nodes (117): WriteError(), WriteJSON(), HandleAdminJurusan(), HandleAdminMitra(), HandleAdminOverview(), decisionOf(), HandleApply(), HandleCVDone() (+109 more)

### Community 8 - "main.py"
Cohesion: 0.08
Nodes (22): _error_response(), FastAPI, Exception handler global biar semua error dari ai-engine punya bentuk JSON yang…, register_error_handlers(), configure_logging(), JSONFormatter, Structured (JSON) logging + request-ID propagation. Setiap baris log dapet…, RequestIDMiddleware (+14 more)

### Community 9 - "StudentReadinessClient.tsx"
Cohesion: 0.07
Nodes (33): GET(), metadata, StudentReadinessClient(), Meter(), MeterProps, Tag(), TagProps, ANALYSIS_STEPS (+25 more)

### Community 10 - "Badge.tsx"
Cohesion: 0.09
Nodes (33): Badge(), BadgeProps, ScoreBox(), ScoreBoxProps, CandidateHeader(), CandidateHeaderProps, CandidateRow(), CandidateRowProps (+25 more)

### Community 11 - "admin/data.ts"
Cohesion: 0.18
Nodes (15): GET(), GET(), GET(), APP_TO_WIRE, renameKeys(), toAppKeys(), toWireKeys(), WIRE_TO_APP (+7 more)

### Community 12 - "Panel.tsx"
Cohesion: 0.12
Nodes (21): DepartmentDetailClientProps, KeyValue(), KeyValueProps, Panel(), PanelProps, Stat(), StatProps, StatGrid() (+13 more)

### Community 13 - "StudyProgramOverview.tsx"
Cohesion: 0.05
Nodes (44): metadata, metadata, metadata, CompetencyRankingPanel(), CompetencyRankingPanelProps, CompetencyRow(), GapSummaryList(), GapSummaryListProps (+36 more)

### Community 14 - "draft_feedback.py"
Cohesion: 0.14
Nodes (22): log_ai_call(), Satu baris log terstruktur per panggilan AI (real atau cache hit) -- ini yang…, Pertahanan anti prompt-injection buat konten buatan kandidat (CV, jawaban…, Bungkus satu blok konten kandidat dengan delimiter tegas + pengingat di akhir.…, wrap_untrusted(), Area, BuktiRingkas, draft_feedback() (+14 more)

### Community 15 - "api"
Cohesion: 0.09
Nodes (35): POST(), ClaimBadge(), ClaimBadgeProps, ClaimEvidenceCard(), ClaimEvidenceCardProps, addNote(), getClaimsAction(), requestClaimUploadAction() (+27 more)

### Community 16 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 17 - "AdminOverview.tsx"
Cohesion: 0.18
Nodes (11): AdminOverviewSection(), metadata, AdminDepartmentsView(), AdminDepartmentsViewProps, AdminOverview(), AdminOverviewProps, AdminStatsCards(), AdminStatsCardsProps (+3 more)

### Community 18 - "ImpactSection.tsx"
Cohesion: 0.14
Nodes (17): Ribbon(), RibbonProps, MetricPrizeCard(), MetricPrizeCardProps, OutcomeRows(), OutcomeRowsProps, PrizeCard(), PrizeCardProps (+9 more)

### Community 19 - "CvUpload.tsx"
Cohesion: 0.22
Nodes (15): CvDropZone(), CvDropZoneProps, CvParseProgress(), CvUpload(), EMPTY_PROFILE, STEPS, ProfileCvUpload(), STEPS (+7 more)

### Community 20 - "test_questions_feedback.py"
Cohesion: 0.32
Nodes (9): _Fake, _post(), MonkeyPatch, Tes generator pertanyaan, draf feedback terstruktur, dan decode file tanpa…, test_decode_file_rejects_oversize(), test_draft_feedback_502_on_malformed(), test_draft_feedback_structured(), test_questions_falls_back_when_model_short_or_broken() (+1 more)

### Community 21 - "parse_cv.py"
Cohesion: 0.16
Nodes (23): extension(), _angka(), _compute(), _extract_pdf_text(), _ground_identitas(), Identitas, _items(), parse_cv() (+15 more)

### Community 22 - "Vacancy"
Cohesion: 0.15
Nodes (17): HrVacancyRow(), HrVacancyRowProps, StatusTrack(), StatusTrackProps, ActiveCandidateBoardProps, ApplyFlowProps, ApplyStepPanel(), ApplyStepPanelProps (+9 more)

### Community 23 - "(site)/page.tsx"
Cohesion: 0.11
Nodes (17): HeroCta(), HeroCtaProps, HeroPieceImage(), HeroPieceImageProps, Chapter, ChapterList(), ChapterListProps, BottomNav() (+9 more)

### Community 24 - "domain_test.go"
Cohesion: 0.18
Nodes (9): TestCategoryThresholds(), TestEvidenceRequiresQuoteWhenFound(), TestMatkulFor(), TestMinKandidatEnforced(), TestScoreWeightsSumTo100(), TestWeightedTotalMatchesProposalExample(), MatkulFor(), CategoryForScore() (+1 more)

### Community 25 - "testStore"
Cohesion: 0.25
Nodes (9): Store, TestDemoAccountsFromEnvRequiresAll(), TestSeedDemo(), testStore(), TestStoreBenchmark(), TestStoreFlow(), TestStoreJobs(), Store (+1 more)

### Community 26 - "StudentLearningHubClient.tsx"
Cohesion: 0.13
Nodes (23): GET(), metadata, StudentLearningHubClient(), AdminLearningManager(), InteractiveDrillModal(), InteractiveDrillModalProps, LearningModuleCard(), LearningModuleCardProps (+15 more)

### Community 27 - "[kode]/page.tsx"
Cohesion: 0.25
Nodes (5): DepartmentDetailClient(), PageProps, DEPARTMENT_DETAILS, DepartmentGapSolution, DepartmentStudyProgram

### Community 28 - "InterviewRoom.tsx"
Cohesion: 0.14
Nodes (18): InterviewChecklist(), InterviewFinished(), InterviewQuestion(), InterviewRoom(), InterviewRoomProps, PracticeSetupPanel(), UploadRetryPanel(), ANSWER_SECONDS (+10 more)

### Community 29 - "looks_like_prompt_attack"
Cohesion: 0.14
Nodes (22): Modul validasi bukti dokumen sertifikasi/portofolio via ekstraksi teks, fuzzy…, Normalisasi NFKC dan bersihkan zero-width/kontrol tersembunyi., Validasi teks dokumen sertifikat terhadap klaim CV. Return dict dengan status:…, sanitize_evidence_text(), validate_claim_evidence(), find_prompt_attack(), looks_like_prompt_attack(), _normalize_for_detection() (+14 more)

### Community 30 - "BuildScore"
Cohesion: 0.17
Nodes (18): evidencesFromJSON(), Evidence, aggregate(), AggregateRanking(), BuildScore(), Ranking, ScoreFromAI(), strp() (+10 more)

### Community 31 - "autoCorrector.ts"
Cohesion: 0.12
Nodes (21): callGemini(), callGroq(), EvaluateItemInput, EvaluateRequestBody, GroqAnalysisItem, GroqResponsePayload, GroqStarOutput, POST() (+13 more)

### Community 32 - "RoleProfileSection.tsx"
Cohesion: 0.14
Nodes (12): instant, metadata, instant, metadata, instant, metadata, RoleProfileSection(), RoleProfileSectionProps (+4 more)

### Community 33 - "Role"
Cohesion: 0.16
Nodes (15): issue(), TestRequireRole(), TestValidateRole(), Role, CheckPassword(), Issue(), TestIssueAndVerify(), TestIssueRejectsInvalidRole() (+7 more)

### Community 34 - "models.go"
Cohesion: 0.22
Nodes (9): scanResultInto(), CandidateScore, Profile, Result, Category, DimensionScore, Entry, JobStatus (+1 more)

### Community 35 - "AdminPartnersView.tsx"
Cohesion: 0.31
Nodes (5): AdminMitraClient(), metadata, AdminPartnersView(), AdminPartnersViewProps, AdminPartnerSummary

### Community 36 - "Faq.tsx"
Cohesion: 0.31
Nodes (5): FaqItem(), FaqItemProps, Faq(), FaqSection(), FAQ

### Community 37 - "ports.go"
Cohesion: 0.09
Nodes (20): Client, fileReq, StatusError, New(), newFileReq(), Feedback, QA, FeedbackInput (+12 more)

### Community 38 - "Pipeline"
Cohesion: 0.19
Nodes (9): Store, T, Pipeline, LengkapiProfil(), nonNil(), ProfilCVRef(), ProfileText(), TestLengkapiProfil() (+1 more)

### Community 39 - "PageHeader.tsx"
Cohesion: 0.08
Nodes (19): AdminJurusanClient(), metadata, metadata, metadata, metadata, metadata, metadata, metadata (+11 more)

### Community 40 - "context.Context"
Cohesion: 0.16
Nodes (11): Answer, Store, Store, RunOne(), RunWorkers(), workLoop(), context.Context, io.Reader (+3 more)

### Community 41 - "BarChart.tsx"
Cohesion: 0.16
Nodes (13): BarChart(), BarChartProps, BarGroup, BarSeries, ChartLegend(), ChartLegendProps, BenchmarkSection(), BenchmarkRow (+5 more)

### Community 42 - "gsap.ts"
Cohesion: 0.22
Nodes (9): FlowPanel(), FlowPin(), FLOW, TABS, setupGsap(), useBarChartReveal(), useHeroStage(), playHeroTransition() (+1 more)

### Community 43 - "Motion.tsx"
Cohesion: 0.23
Nodes (16): Motion(), MotionProps, magneticButtons(), scrollScrub(), wiggleInView(), countUp(), growBars(), revealRows() (+8 more)

### Community 44 - "useUserBadge.ts"
Cohesion: 0.33
Nodes (7): UserProfileBadge(), UserProfileBadgeProps, ROLE_INFO, ROLE_PROFILE_HREF, UserBadgeParams, UserBadgeResult, useUserBadge()

### Community 45 - "login.ts"
Cohesion: 0.25
Nodes (9): login(), SessionResponse, register(), safeNext(), setSession(), editDistance(), POPULAR_PROVIDERS, REAL_DOMAINS (+1 more)

### Community 46 - "intro.ts"
Cohesion: 0.36
Nodes (5): INTRO_DONE, INTRO_SCRIPT, lenisRef, setupSmoothScroll(), onIntro()

### Community 47 - "ModelBenchmark"
Cohesion: 0.15
Nodes (14): Store, RefreshBenchmark(), RunBenchmarkRefresh(), Store, TestRefreshBenchmark(), newFakes(), TestAnalisisPermanentErrorNotRetried(), TestAnalisisScoresPendingOnceAndFillsMatkul() (+6 more)

### Community 48 - "ClaimEvidence"
Cohesion: 0.50
Nodes (3): Store, ClaimEvidence, ClaimStatus

### Community 49 - "student.ts"
Cohesion: 0.11
Nodes (24): metadata, CandidateStats(), CategoryFilter(), CategoryFilterProps, DimensionBars(), DimensionBarsProps, FeedbackRow(), FeedbackRowProps (+16 more)

### Community 50 - "LoginPanel.tsx"
Cohesion: 0.11
Nodes (16): metadata, metadata, AuthArt(), AuthArtProps, LabeledSegmented(), LabeledSegmentedProps, Segmented(), SegmentedProps (+8 more)

### Community 51 - "PracticeSetupPanel.tsx"
Cohesion: 0.53
Nodes (4): InterviewChecklistProps, PracticeSetupPanelProps, PracticeCategory, CameraState

### Community 52 - "main"
Cohesion: 0.35
Nodes (9): env(), main(), DemoAccountsFromEnv(), Store, SeedDemo(), seedKandidatRow(), DemoAccount, seedFixture (+1 more)

### Community 53 - "ReadinessProfile"
Cohesion: 0.17
Nodes (10): Store, ReadinessProfile, ReadinessActionRecommendation, ReadinessCompetency, ReadinessDimension, ReadinessHistoryEntry, ReadinessActionRecommendation, ReadinessCompetency (+2 more)

### Community 55 - "testing.T"
Cohesion: 0.15
Nodes (21): TestHealth(), TestProductionAccountsFromEnv_Missing(), TestProductionAccountsFromEnv_Valid(), TestSeedProduction(), TestSeedProductionSQL_Contains5Students(), TestSeedProductionSQL_ContainsApplications(), TestSeedProductionSQL_ContainsVacancies(), TestSeedProductionSQL_IdempotentExecution() (+13 more)

### Community 57 - "(site)/layout.tsx"
Cohesion: 0.24
Nodes (7): SiteLayoutProps, Logo(), LogoProps, COLUMNS, Footer(), LINKS, Nav()

### Community 58 - "ProblemSection.tsx"
Cohesion: 0.23
Nodes (7): GuardCard(), GuardCardProps, StatStep(), StatStepProps, ProblemSection(), DIFFERENTIATORS, STATS

### Community 59 - "test_benchmark.py"
Cohesion: 0.30
Nodes (7): _Fake, _Gagal, _post(), MonkeyPatch, Benchmark per fitur dengan provider palsu: fitur asli dijalankan, provider…, test_benchmark_per_fitur(), test_semua_model_gagal_502()

### Community 60 - "InterviewVideo.tsx"
Cohesion: 0.20
Nodes (10): RecDot(), RecDotProps, InterviewVideo(), InterviewVideoProps, RecordingIndicator(), RecordingIndicatorProps, InterviewProgress(), InterviewProgressProps (+2 more)

### Community 61 - "pull_request_template.md"
Cohesion: 0.22
Nodes (8): 1. **Readiness Tracker Mahasiswa (`/mahasiswa/readiness`)**, 2. **Learning Hub & Interactive Drills (`/mahasiswa/learning-hub`)**, 3. **Admin Pusat Karier Kampus (`/admin`)**, 🚀 Fitur Baru & Peningkatan yang Diimplementasikan, 📌 Jenis Perubahan, 🧪 Panduan Pengujian Lokal (Verification Steps), 🎯 Ringkasan Pull Request (PR), 🛡️ Standar Kualitas & Keamanan (Security & Antislop)

### Community 62 - "SeedProduction"
Cohesion: 0.36
Nodes (8): escapeSQL(), main(), DefaultProductionAccounts(), Store, ProductionAccountsFromEnv(), SeedProduction(), HashPassword(), SeedAccount

### Community 64 - "TestFullFlow"
Cohesion: 0.33
Nodes (8): CORS(), drain(), register(), TestCORSAllowsListedOriginsOnly(), TestEveryRouteForbidsOtherRoles(), TestFullFlow(), net/http.Handler, client

### Community 65 - "CorrectCategory"
Cohesion: 0.31
Nodes (8): CorrectCategory(), ReviewFeedback(), TestCorrectCategoryAccepts(), TestCorrectCategoryKeepsAIWithoutReason(), TestCorrectCategoryNeedsReason(), TestCorrectCategoryRejectsUnknown(), TestReviewFeedbackNeedsReview(), ValidDecision()

### Community 66 - "useInterviewTranscript.ts"
Cohesion: 0.20
Nodes (8): SpeechRecognitionAlternative, SpeechRecognitionConstructor, SpeechRecognitionEventLike, SpeechRecognitionInstance, SpeechRecognitionResultItem, SpeechRecognitionResultList, UseInterviewTranscriptOptions, UseInterviewTranscriptReturn

### Community 67 - "schema.sql"
Cohesion: 0.36
Nodes (9): benchmark, catatan, claim_evidences, hasil, jawaban_interview, jobs, lamaran, lowongan (+1 more)

### Community 68 - "learning.go"
Cohesion: 0.33
Nodes (6): Store, DrillSubmissionResult, LearningOverview, LearningDrill, LearningDrillOption, LearningModule

### Community 69 - "FilterRanking"
Cohesion: 0.36
Nodes (7): FilterRanking(), Ranking, sampleRanking(), TestFilterRankingHidesUnder10(), TestFilterRankingKeepsAggregateOnly(), Ranking, RankItem

### Community 70 - "_with_timeout_and_retry"
Cohesion: 0.29
Nodes (4): T, Timeout eksplisit + satu retry buat error transient (timeout, 5xx, connection…, Bisa nerima teks doang atau teks+gambar (vision) -- dipakai parse_cv.py buat CV…, _with_timeout_and_retry()

### Community 71 - "useLoaderIntro.ts"
Cohesion: 0.19
Nodes (10): DottedArrow(), PTS, DottedX(), PTS, Loader(), clipHole(), useLoaderIntro(), INTRO_REVEAL (+2 more)

### Community 72 - "gridCanvas.ts"
Cohesion: 0.42
Nodes (6): GridCanvas(), createGridCanvas(), buildCells(), Cell, drawCells(), GRID_COLORS

### Community 73 - "useInterviewVoice.ts"
Cohesion: 0.38
Nodes (5): useInterviewVoice(), UseInterviewVoiceOptions, useUniversalTts(), UseUniversalTtsOptions, UseUniversalTtsReturn

### Community 74 - "interviewPractice.ts"
Cohesion: 0.33
Nodes (6): generatePracticeQuestions(), getPersonalizedQuestionBank(), PRACTICE_CATEGORIES, PRACTICE_QUESTION_BANK, PracticeProfileContext, PracticeQuestionItem

### Community 76 - ".AdminJurusan"
Cohesion: 0.39
Nodes (4): Store, AdminJurusanSummary, AdminMitraSummary, AdminOverview

### Community 78 - "RolesSection.tsx"
Cohesion: 0.43
Nodes (5): RoleCard(), RoleCardProps, RolesSection(), LANDING_ROLES, LandingRole

### Community 79 - "auth.ts"
Cohesion: 0.15
Nodes (14): DashboardLayoutProps, HeaderUserBadge(), SessionSidebar(), ICON, Sidebar(), SidebarProps, logout(), DASHBOARD_MENU (+6 more)

### Community 81 - "test_security.py"
Cohesion: 0.43
Nodes (6): MonkeyPatch, X-Internal-Api-Key adalah satu-satunya trust boundary servis ini (gak ada CORS…, test_fails_closed_when_server_has_no_key_configured(), test_healthz_and_readyz_are_not_gated(), test_rejects_request_with_no_key(), test_rejects_request_with_wrong_key()

### Community 82 - "Backend Pintu Karier"
Cohesion: 0.33
Nodes (5): Backend Pintu Karier, Baseline, Jalan, Struktur, Titik migrasi tunda

### Community 83 - "Permohonan Pull Request: Integrasi Learning Hub & Interactive Competency Drills"
Cohesion: 0.40
Nodes (4): 📌 Deskripsi Pull Request, 🌟 Fitur Baru & Peningkatan:, Permohonan Pull Request: Integrasi Learning Hub & Interactive Competency Drills, 🔗 Tautan Review Langsung

### Community 84 - "feedback/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, FeedbackLetter(), FeedbackSection()

### Community 85 - "app/layout.tsx"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, metadata, viewport

### Community 86 - "time.Time"
Cohesion: 0.18
Nodes (17): dims(), durasi(), effectiveCategory(), feedbackOf(), kandidatOf(), TestPeriode(), Angkatan(), Periode() (+9 more)

### Community 87 - "tts/route.ts"
Cohesion: 0.50
Nodes (4): audioCache, GET(), synthesizeEdgeTts(), TtsErrorResponse

### Community 89 - "Pintu Karier"
Cohesion: 0.40
Nodes (4): 1. Tentang Pintu Karier, 2. Struktur Proyek, 3. Menjalankan Lingkungan Lokal, Pintu Karier

### Community 91 - "conftest.py"
Cohesion: 0.50
Nodes (3): Fixture bersama: tidak ada test yang diam-diam manggil provider AI asli., reset_settings_cache(), fixture

### Community 92 - "TestNotFoundJSON"
Cohesion: 0.67
Nodes (3): decodeBody(), TestNotFoundJSON(), net/http/httptest.ResponseRecorder

### Community 94 - "transcribe_audio.py"
Cohesion: 0.67
Nodes (3): main(), Script transkripsi audio vokal interview kandidat memakai ffmpeg dan…, transcribe_file()

## Knowledge Gaps
- **278 isolated node(s):** `pintukarier-backend`, `ErrorResponse`, `RegisterRequest`, `LoginRequest`, `SessionResponse` (+273 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api()` connect `api` to `ApplicationRow.tsx`, `Button.tsx`, `PageHeader.tsx`, `StudentReadinessClient.tsx`, `Badge.tsx`, `admin/data.ts`, `BarChart.tsx`, `Panel.tsx`, `StudyProgramOverview.tsx`, `login.ts`, `auth.ts`, `student.ts`, `feedback/page.tsx`, `StudentLearningHubClient.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `Panel()` connect `Panel.tsx` to `ApplicationRow.tsx`, `Button.tsx`, `AdminPartnersView.tsx`, `ProfileReview.tsx`, `StudentReadinessClient.tsx`, `Badge.tsx`, `StudyProgramOverview.tsx`, `InterviewRoom.tsx`, `student.ts`, `AdminOverview.tsx`, `PracticeSetupPanel.tsx`, `Vacancy`, `InterviewVideo.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button.tsx` to `ApplicationRow.tsx`, `ProfileReview.tsx`, `Badge.tsx`, `Panel.tsx`, `StudyProgramOverview.tsx`, `api`, `student.ts`, `AdminOverview.tsx`, `CvUpload.tsx`, `PracticeSetupPanel.tsx`, `LoginPanel.tsx`, `Vacancy`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `pintukarier-backend`, `ErrorResponse`, `RegisterRequest` to the rest of the system?**
  _278 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ApplicationRow.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08246225319396051 - nodes in this community are weakly interconnected._
- **Should `score.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09219858156028368 - nodes in this community are weakly interconnected._
- **Should `Button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13109243697478992 - nodes in this community are weakly interconnected._