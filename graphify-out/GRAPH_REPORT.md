# Graph Report - PintuKarier  (2026-11-06)

## Corpus Check
- 403 files · ~196,742 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1831 nodes · 4516 edges · 111 communities (101 shown, 10 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 261 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `05ecd2e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- student.ts
- score.py
- Panel.tsx
- devDependencies
- benchmark.py
- Store
- StudentAccount
- Deps
- main.py
- readiness/page.tsx
- ActiveCandidateBoard.tsx
- admin/data.ts
- StudyProgramCompetencyView.tsx
- StudyProgramOverview.tsx
- draft_feedback.py
- api
- compilerOptions
- postgres/store.go
- ImpactSection.tsx
- CvUpload.tsx
- test_questions_feedback.py
- parse_cv.py
- Vacancy
- (site)/page.tsx
- testing.T
- NewID
- learning-hub/page.tsx
- AnalysisProgress.tsx
- InterviewRoom.tsx
- looks_like_prompt_attack
- BuildScore
- autoCorrector.ts
- RoleProfileSection.tsx
- Role
- models.go
- claimActions.ts
- studyProgram/types.ts
- ports.go
- context.Context
- Skeleton.tsx
- fakeStore
- BarChart.tsx
- prefersReducedMotion
- Motion.tsx
- UserRole
- login.ts
- RegisterPanel.tsx
- ModelBenchmark
- StudyProgramCompetencySection.tsx
- Badge.tsx
- LoginPanel.tsx
- PageHeader.tsx
- main
- ReadinessProfile
- RunOne
- NewLocal
- Feedback
- (site)/layout.tsx
- ProblemSection.tsx
- test_benchmark.py
- InterviewVideo.tsx
- pull_request_template.md
- SeedProduction
- Loader.tsx
- TestFullFlow
- CorrectCategory
- useInterviewTranscript.ts
- schema.sql
- learning.go
- FilterRanking
- _with_timeout_and_retry
- gsap.ts
- gridCanvas.ts
- useInterviewVoice.ts
- interviewPractice.ts
- HeroIllustration.tsx
- .AdminJurusan
- CvDropZone.tsx
- RolesSection.tsx
- Sidebar.tsx
- FollowUpNote
- test_security.py
- Backend Pintu Karier
- Permohonan Pull Request: Integrasi Learning Hub & Interactive Competency Drills
- feedback/page.tsx
- app/layout.tsx
- Angkatan
- tts/route.ts
- mahasiswa/profil/page.tsx
- Pintu Karier
- apiKeys.ts
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
3. `WriteJSON()` - 40 edges
4. `Panel()` - 38 edges
5. `fail()` - 37 edges
6. `Button()` - 36 edges
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
- `HandleProfilCVDone()` --calls--> `ProfilCVRef()`  [EXTRACTED]
  backend/internal/adapter/http/handlers/handlers_auth.go → backend/internal/usecase/pipeline.go
- `RegisterRoutes()` --calls--> `CORS()`  [INFERRED]
  backend/internal/adapter/http/handlers/routes.go → backend/internal/adapter/http/handlers/handlers_files.go

## Import Cycles
- None detected.

## Communities (111 total, 10 thin omitted)

### Community 0 - "student.ts"
Cohesion: 0.08
Nodes (33): ACTION_BY_STATUS, ApplicationRow(), ApplicationRowProps, ChipList(), ChipListProps, KeyValue(), KeyValueProps, Pagination() (+25 more)

### Community 1 - "score.py"
Cohesion: 0.09
Nodes (44): assemble(), build_prompt(), build_requirements(), Bukti, detect_injection(), factor_score(), _get_additional_score(), _get_certification_score() (+36 more)

### Community 2 - "Panel.tsx"
Cohesion: 0.09
Nodes (34): DashboardErrorProps, Button(), ButtonProps, DecisionSentPanel(), DecisionSentPanelProps, EvaluationNote(), EvaluationNoteProps, Field() (+26 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (43): eslint, eslint-config-next, dependencies, gsap, @gsap/react, lenis, next, @phosphor-icons/react (+35 more)

### Community 4 - "benchmark.py"
Cohesion: 0.08
Nodes (39): ABC, get_settings(), Config typed dari env var, di-load sekali di startup lewat pydantic-settings., Settings, decode_file(), FileRequest, BaseModel, File kandidat dikirim backend Go sebagai base64 di body JSON. Backend sudah… (+31 more)

### Community 5 - "Store"
Cohesion: 0.11
Nodes (14): collect(), Store, notFound(), Open(), scanApp(), scanJob(), scanUser(), scanVacancy() (+6 more)

### Community 6 - "StudentAccount"
Cohesion: 0.14
Nodes (18): SkillEditor(), SkillEditorProps, AcademicDataForm(), AcademicDataFormProps, ProfileReview(), ProfileSidebar(), ProfileSidebarProps, ProfileSummaryPanelProps (+10 more)

### Community 7 - "Deps"
Cohesion: 0.05
Nodes (126): WriteError(), WriteJSON(), HandleAdminJurusan(), HandleAdminMitra(), HandleAdminOverview(), decisionOf(), HandleApply(), HandleCVDone() (+118 more)

### Community 8 - "main.py"
Cohesion: 0.08
Nodes (22): _error_response(), FastAPI, Exception handler global biar semua error dari ai-engine punya bentuk JSON yang…, register_error_handlers(), configure_logging(), JSONFormatter, Structured (JSON) logging + request-ID propagation. Setiap baris log dapet…, RequestIDMiddleware (+14 more)

### Community 9 - "readiness/page.tsx"
Cohesion: 0.13
Nodes (21): GET(), StudentReadinessPage(), ReadinessActionRecommendations(), ReadinessActionRecommendationsProps, ReadinessCompetencyMatrix(), ReadinessCompetencyMatrixProps, ReadinessDimensionBreakdown(), ReadinessDimensionBreakdownProps (+13 more)

### Community 10 - "ActiveCandidateBoard.tsx"
Cohesion: 0.09
Nodes (28): CandidateHeader(), CandidateHeaderProps, CandidateRow(), CandidateRowProps, CandidateStats(), CandidateStatsProps, CategoryFilter(), CategoryFilterProps (+20 more)

### Community 11 - "admin/data.ts"
Cohesion: 0.11
Nodes (26): GET(), GET(), GET(), AdminJurusanPage(), AdminMitraPage(), AdminDashboardPage(), AdminDepartmentsView(), AdminDepartmentsViewProps (+18 more)

### Community 12 - "StudyProgramCompetencyView.tsx"
Cohesion: 0.14
Nodes (15): CompetencyRankingPanel(), CompetencyRankingPanelProps, CompetencyRow(), EmptyState(), EmptyStateProps, ClaimEvidenceSectionProps, FollowUpNotes(), LatestFeedbackPanel() (+7 more)

### Community 13 - "StudyProgramOverview.tsx"
Cohesion: 0.10
Nodes (20): Meter(), MeterProps, CompetencyRowProps, DimensionBars(), DimensionBarsProps, GapSummaryList(), GapSummaryListProps, OverviewModuleCard() (+12 more)

### Community 14 - "draft_feedback.py"
Cohesion: 0.14
Nodes (22): log_ai_call(), Satu baris log terstruktur per panggilan AI (real atau cache hit) -- ini yang…, Pertahanan anti prompt-injection buat konten buatan kandidat (CV, jawaban…, Bungkus satu blok konten kandidat dengan delimiter tegas + pengingat di akhir.…, wrap_untrusted(), Area, BuktiRingkas, draft_feedback() (+14 more)

### Community 15 - "api"
Cohesion: 0.15
Nodes (20): POST(), GET(), addNote(), completeUpload(), createVacancy(), NewVacancy, getApplicationProfile(), getStudentProfile() (+12 more)

### Community 16 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 17 - "postgres/store.go"
Cohesion: 0.11
Nodes (14): evidencesToJSON(), T, nonNil(), scanCandidate(), scanJSON(), scanResultInto(), srcBytes(), toJSON() (+6 more)

### Community 18 - "ImpactSection.tsx"
Cohesion: 0.11
Nodes (19): metadata, Ribbon(), RibbonProps, MetricPrizeCard(), MetricPrizeCardProps, OutcomeRows(), OutcomeRowsProps, PrizeCard() (+11 more)

### Community 19 - "CvUpload.tsx"
Cohesion: 0.17
Nodes (18): CvParseProgress(), CvParseProgressProps, CvUpload(), CvUploadProps, EMPTY_PROFILE, STEPS, ProfileCvUpload(), ProfileCvUploadProps (+10 more)

### Community 20 - "test_questions_feedback.py"
Cohesion: 0.32
Nodes (9): _Fake, _post(), MonkeyPatch, Tes generator pertanyaan, draf feedback terstruktur, dan decode file tanpa…, test_decode_file_rejects_oversize(), test_draft_feedback_502_on_malformed(), test_draft_feedback_structured(), test_questions_falls_back_when_model_short_or_broken() (+1 more)

### Community 21 - "parse_cv.py"
Cohesion: 0.16
Nodes (23): extension(), _angka(), _compute(), _extract_pdf_text(), _ground_identitas(), Identitas, _items(), parse_cv() (+15 more)

### Community 22 - "Vacancy"
Cohesion: 0.12
Nodes (20): HrVacancyRow(), HrVacancyRowProps, StatusTrack(), StatusTrackProps, VacancySelect(), VacancySelectProps, ApplyFlow(), ApplyFlowProps (+12 more)

### Community 23 - "(site)/page.tsx"
Cohesion: 0.13
Nodes (15): HeroCta(), HeroCtaProps, Chapter, ChapterList(), ChapterListProps, BottomNav(), ClosingSection(), EntrySection() (+7 more)

### Community 24 - "testing.T"
Cohesion: 0.13
Nodes (18): TestHealth(), TestProductionAccountsFromEnv_Missing(), TestProductionAccountsFromEnv_Valid(), TestSeedProductionSQL_Contains5Students(), TestSeedProductionSQL_ContainsApplications(), TestSeedProductionSQL_ContainsVacancies(), TestSeedProductionSQL_IdempotentExecution(), TestSeedProductionSQL_JSONAndReferencesValidity() (+10 more)

### Community 25 - "NewID"
Cohesion: 0.16
Nodes (19): TestSeedProduction(), Store, TestSeedDemo(), testStore(), TestStoreBenchmark(), TestStoreFlow(), TestStoreJobs(), Store (+11 more)

### Community 26 - "learning-hub/page.tsx"
Cohesion: 0.20
Nodes (16): StudentLearningHubPage(), InteractiveDrillModal(), InteractiveDrillModalProps, LearningModuleCard(), LearningModuleCardProps, LearningSummaryBanner(), LearningSummaryBannerProps, fetchStudentLearning() (+8 more)

### Community 27 - "AnalysisProgress.tsx"
Cohesion: 0.33
Nodes (5): ANALYSIS_STEPS, AnalysisProgress(), AnalysisProgressProps, StepList(), StepListProps

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
Cohesion: 0.12
Nodes (13): instant, metadata, instant, metadata, instant, metadata, RoleProfileSection(), RoleProfileView() (+5 more)

### Community 33 - "Role"
Cohesion: 0.18
Nodes (13): issue(), TestRequireRole(), TestValidateRole(), Role, Issue(), TestIssueAndVerify(), TestIssueRejectsInvalidRole(), TestValidEmail() (+5 more)

### Community 34 - "models.go"
Cohesion: 0.16
Nodes (11): Store, CandidateScore, ClaimEvidence, ClaimStatus, Profile, Result, Category, DimensionScore (+3 more)

### Community 35 - "claimActions.ts"
Cohesion: 0.20
Nodes (14): ClaimBadge(), ClaimBadgeProps, ClaimEvidenceCard(), ClaimEvidenceCardProps, ClaimEvidenceSection(), getClaimsAction(), requestClaimUploadAction(), verifyClaimAction() (+6 more)

### Community 36 - "studyProgram/types.ts"
Cohesion: 0.33
Nodes (6): CURRICULUM_RECOMMENDATIONS, GASAL_2025, GASAL_2026, GENAP_2025, CurriculumRecommendation, Ranking

### Community 37 - "ports.go"
Cohesion: 0.09
Nodes (19): Client, fileReq, StatusError, New(), newFileReq(), QA, FileStore, ParsedCV (+11 more)

### Community 38 - "context.Context"
Cohesion: 0.18
Nodes (11): Store, T, Pipeline, LengkapiProfil(), nonNil(), ProfilCVRef(), ProfileText(), TestLengkapiProfil() (+3 more)

### Community 39 - "Skeleton.tsx"
Cohesion: 0.13
Nodes (9): metadata, metadata, metadata, metadata, Skeleton(), SkeletonProps, CandidateDetail(), PracticeInterviewSection() (+1 more)

### Community 40 - "fakeStore"
Cohesion: 0.19
Nodes (8): Answer, Store, newFakes(), TestAnalisisPermanentErrorNotRetried(), TestAnalisisScoresPendingOnceAndFillsMatkul(), TestAnalisisWaitsForTranscript(), fakeAI, fakeStore

### Community 41 - "BarChart.tsx"
Cohesion: 0.16
Nodes (13): BarChart(), BarChartProps, BarGroup, BarSeries, ChartLegend(), ChartLegendProps, BenchmarkSection(), BenchmarkRow (+5 more)

### Community 42 - "prefersReducedMotion"
Cohesion: 0.18
Nodes (10): FaqItem(), FaqItemProps, FlowPanel(), Faq(), FaqSection(), FlowPin(), FAQ, FLOW (+2 more)

### Community 43 - "Motion.tsx"
Cohesion: 0.25
Nodes (14): Motion(), MotionProps, magneticButtons(), scrollScrub(), wiggleInView(), countUp(), growBars(), revealRows() (+6 more)

### Community 44 - "UserRole"
Cohesion: 0.27
Nodes (9): UserProfileBadge(), UserProfileBadgeProps, RoleProfileSectionProps, SessionResponse, UserRole, ROLE_PROFILE_HREF, UserBadgeParams, UserBadgeResult (+1 more)

### Community 45 - "login.ts"
Cohesion: 0.31
Nodes (7): login(), safeNext(), setSession(), editDistance(), POPULAR_PROVIDERS, REAL_DOMAINS, validateEmail()

### Community 46 - "RegisterPanel.tsx"
Cohesion: 0.22
Nodes (10): INSTITUTION_FIELD, RegisterPanel(), ROLE_LABELS, AuthState, register(), DEMO_ACCOUNTS, DemoAccount, ROLE_INFO (+2 more)

### Community 47 - "ModelBenchmark"
Cohesion: 0.20
Nodes (9): Store, RefreshBenchmark(), RunBenchmarkRefresh(), Store, TestRefreshBenchmark(), ModelBenchmark, AIService, benchAI (+1 more)

### Community 49 - "Badge.tsx"
Cohesion: 0.14
Nodes (21): Badge(), BadgeProps, ScoreBox(), ScoreBoxProps, Tag(), TagProps, EvidenceItemProps, FeedbackRow() (+13 more)

### Community 50 - "LoginPanel.tsx"
Cohesion: 0.22
Nodes (7): metadata, AuthArt(), AuthArtProps, LOGIN_PLACEHOLDERS, LoginPanel(), ROLE_LABELS, RoleLoginPlaceholder

### Community 51 - "PageHeader.tsx"
Cohesion: 0.11
Nodes (13): metadata, metadata, metadata, metadata, metadata, HeaderUserBadge(), PageHeader(), PageHeaderProps (+5 more)

### Community 52 - "main"
Cohesion: 0.30
Nodes (10): env(), main(), DemoAccountsFromEnv(), Store, SeedDemo(), seedKandidatRow(), TestDemoAccountsFromEnvRequiresAll(), DemoAccount (+2 more)

### Community 53 - "ReadinessProfile"
Cohesion: 0.17
Nodes (10): Store, ReadinessProfile, ReadinessActionRecommendation, ReadinessCompetency, ReadinessDimension, ReadinessHistoryEntry, ReadinessActionRecommendation, ReadinessCompetency (+2 more)

### Community 54 - "RunOne"
Cohesion: 0.80
Nodes (5): Store, RunOne(), RunWorkers(), workLoop(), JobRunner

### Community 55 - "NewLocal"
Cohesion: 0.24
Nodes (8): NewLocal(), TestReadRoundTripAndTraversal(), TestSaveAcceptsPDF(), TestSaveRejectsBadExtension(), TestSaveRejectsOversize(), TestSaveRejectsTraversal(), io.Reader, Local

### Community 56 - "Feedback"
Cohesion: 0.38
Nodes (4): Area, Feedback, FeedbackInput, FeedbackData

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
Cohesion: 0.31
Nodes (9): escapeSQL(), main(), DefaultProductionAccounts(), Store, ProductionAccountsFromEnv(), SeedProduction(), HashPassword(), TestPasswordHash() (+1 more)

### Community 63 - "Loader.tsx"
Cohesion: 0.32
Nodes (5): DottedArrow(), PTS, DottedX(), PTS, Loader()

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

### Community 71 - "gsap.ts"
Cohesion: 0.19
Nodes (14): clipHole(), useHeroStage(), useLoaderIntro(), INTRO_DONE, INTRO_REVEAL, INTRO_SCRIPT, lenisRef, playHeroTransition() (+6 more)

### Community 72 - "gridCanvas.ts"
Cohesion: 0.42
Nodes (6): GridCanvas(), createGridCanvas(), buildCells(), Cell, drawCells(), GRID_COLORS

### Community 73 - "useInterviewVoice.ts"
Cohesion: 0.28
Nodes (7): InterviewQuestionProps, useInterviewVoice(), UseInterviewVoiceOptions, UseInterviewVoiceReturn, useUniversalTts(), UseUniversalTtsOptions, UseUniversalTtsReturn

### Community 74 - "interviewPractice.ts"
Cohesion: 0.33
Nodes (6): generatePracticeQuestions(), getPersonalizedQuestionBank(), PRACTICE_CATEGORIES, PRACTICE_QUESTION_BANK, PracticeProfileContext, PracticeQuestionItem

### Community 75 - "HeroIllustration.tsx"
Cohesion: 0.33
Nodes (5): HeroPieceImage(), HeroPieceImageProps, DECORATIONS, HeroIllustration(), HeroIllustrationProps

### Community 76 - ".AdminJurusan"
Cohesion: 0.39
Nodes (4): Store, AdminJurusanSummary, AdminMitraSummary, AdminOverview

### Community 77 - "CvDropZone.tsx"
Cohesion: 0.48
Nodes (5): CvDropZone(), CvDropZoneProps, ALLOWED_CV_TYPES, MAX_CV_MB, validateCvFile()

### Community 78 - "RolesSection.tsx"
Cohesion: 0.43
Nodes (5): RoleCard(), RoleCardProps, RolesSection(), LANDING_ROLES, LandingRole

### Community 79 - "Sidebar.tsx"
Cohesion: 0.21
Nodes (8): DashboardLayoutProps, SessionSidebar(), ICON, Sidebar(), SidebarProps, logout(), DASHBOARD_MENU, Session

### Community 80 - "FollowUpNote"
Cohesion: 0.33
Nodes (6): NoteItem(), NoteItemProps, TONE, FollowUpNotesProps, StudyProgramCompetencyViewProps, FollowUpNote

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

### Community 86 - "Angkatan"
Cohesion: 0.60
Nodes (4): TestPeriode(), Angkatan(), Periode(), TahunAjaranMulai()

### Community 87 - "tts/route.ts"
Cohesion: 0.50
Nodes (4): audioCache, GET(), synthesizeEdgeTts(), TtsErrorResponse

### Community 89 - "Pintu Karier"
Cohesion: 0.40
Nodes (4): 1. Tentang Pintu Karier, 2. Struktur Proyek, 3. Menjalankan Lingkungan Lokal, Pintu Karier

### Community 90 - "apiKeys.ts"
Cohesion: 0.50
Nodes (4): APP_TO_WIRE, renameKeys(), toWireKeys(), WIRE_TO_APP

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
- **267 isolated node(s):** `pintukarier-backend`, `ErrorResponse`, `RegisterRequest`, `LoginRequest`, `SessionResponse` (+262 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api()` connect `api` to `student.ts`, `RoleProfileSection.tsx`, `Panel.tsx`, `claimActions.ts`, `Skeleton.tsx`, `readiness/page.tsx`, `ActiveCandidateBoard.tsx`, `admin/data.ts`, `BarChart.tsx`, `login.ts`, `RegisterPanel.tsx`, `StudyProgramCompetencySection.tsx`, `CvUpload.tsx`, `feedback/page.tsx`, `mahasiswa/profil/page.tsx`, `apiKeys.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `Badge()` connect `Badge.tsx` to `student.ts`, `Panel.tsx`, `claimActions.ts`, `readiness/page.tsx`, `admin/data.ts`, `StudyProgramOverview.tsx`, `FollowUpNote`, `Vacancy`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `Panel()` connect `Panel.tsx` to `student.ts`, `StudentAccount`, `ActiveCandidateBoard.tsx`, `StudyProgramCompetencyView.tsx`, `StudyProgramOverview.tsx`, `InterviewRoom.tsx`, `Badge.tsx`, `ImpactSection.tsx`, `Vacancy`, `InterviewVideo.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `pintukarier-backend`, `ErrorResponse`, `RegisterRequest` to the rest of the system?**
  _267 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `student.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08418367346938775 - nodes in this community are weakly interconnected._
- **Should `score.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09219858156028368 - nodes in this community are weakly interconnected._
- **Should `Panel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08708357685563997 - nodes in this community are weakly interconnected._