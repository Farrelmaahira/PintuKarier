// Package aiengine implementasi usecase.AIService lewat REST internal ke
// AI Engine FastAPI. Diadaptasi dari client direkrut-AI api-go.
package aiengine

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"pintukarier-backend/internal/domain"
	"pintukarier-backend/internal/usecase"
)

type Client struct {
	baseURL    string
	apiKey     string
	httpClient *http.Client
	// patient tanpa timeout klien untuk benchmark (beberapa menit); batasnya dari deadline context.
	patient *http.Client
	// slots batasi panggilan paralel ke engine: rate limiting sisi backend.
	slots chan struct{}
}

var _ usecase.AIService = (*Client)(nil)

func New(baseURL, apiKey string, maxConcurrent int) *Client {
	return &Client{
		baseURL:    baseURL,
		apiKey:     apiKey,
		httpClient: &http.Client{Timeout: 90 * time.Second},
		patient:    &http.Client{},
		slots:      make(chan struct{}, max(1, maxConcurrent)),
	}
}

// StatusError membawa status HTTP engine; 4xx selain 429 dibungkus ErrPermanent.
type StatusError struct {
	Code    int
	Path    string
	Message string
}

func (e *StatusError) Error() string {
	return fmt.Sprintf("AI Engine %s membalas %d: %s", e.Path, e.Code, e.Message)
}

func (e *StatusError) Unwrap() error {
	if e.Code >= 400 && e.Code < 500 && e.Code != http.StatusTooManyRequests {
		return usecase.ErrPermanent
	}
	return nil
}

func (c *Client) doJSON(ctx context.Context, path string, reqBody, respBody any) error {
	return c.doJSONWith(ctx, c.httpClient, path, reqBody, respBody)
}

func (c *Client) doJSONWith(ctx context.Context, hc *http.Client, path string, reqBody, respBody any) error {
	select {
	case c.slots <- struct{}{}:
		defer func() { <-c.slots }()
	case <-ctx.Done():
		return ctx.Err()
	}

	b, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("aiengine: marshal request: %w", err)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+path, bytes.NewReader(b))
	if err != nil {
		return fmt.Errorf("aiengine: buat request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Internal-Api-Key", c.apiKey)

	resp, err := hc.Do(req)
	if err != nil {
		return fmt.Errorf("aiengine: POST %s: %w", path, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		// Engine membalas {"error": {"code", "message"}}, lihat ai-engine/app/errors.py.
		var env struct {
			Error struct {
				Message string `json:"message"`
			} `json:"error"`
		}
		raw, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		if json.Unmarshal(raw, &env) != nil || env.Error.Message == "" {
			env.Error.Message = string(raw)
		}
		return &StatusError{Code: resp.StatusCode, Path: path, Message: env.Error.Message}
	}
	if err := json.NewDecoder(resp.Body).Decode(respBody); err != nil {
		return fmt.Errorf("aiengine: decode response: %w", err)
	}
	return nil
}

type fileReq struct {
	FileB64  string `json:"file_b64"`
	Filename string `json:"filename"`
}

func newFileReq(file []byte, filename string) fileReq {
	return fileReq{FileB64: base64.StdEncoding.EncodeToString(file), Filename: filename}
}

func (c *Client) ParseCV(ctx context.Context, file []byte, filename string) (usecase.ParsedCV, error) {
	var out usecase.ParsedCV
	err := c.doJSON(ctx, "/v1/parse-cv", newFileReq(file, filename), &out)
	return out, err
}

func (c *Client) Transcribe(ctx context.Context, file []byte, filename string) (usecase.Transcript, error) {
	var out usecase.Transcript
	err := c.doJSON(ctx, "/v1/transcribe", newFileReq(file, filename), &out)
	return out, err
}

func (c *Client) Questions(ctx context.Context, in usecase.QuestionsInput) (usecase.Questions, error) {
	var out usecase.Questions
	err := c.doJSON(ctx, "/v1/questions", in, &out)
	return out, err
}

func (c *Client) Score(ctx context.Context, in usecase.ScoreInput) (usecase.ScoreResult, error) {
	var out usecase.ScoreResult
	err := c.doJSON(ctx, "/v1/score", in, &out)
	return out, err
}

func (c *Client) DraftFeedback(ctx context.Context, in usecase.FeedbackInput) (domain.Feedback, error) {
	if in.Bukti == nil {
		in.Bukti = []usecase.AIBukti{}
	}
	var out domain.Feedback
	err := c.doJSON(ctx, "/v1/draft-feedback", in, &out)
	return out, err
}

func (c *Client) Benchmark(ctx context.Context) ([]usecase.ModelBenchmark, error) {
	out := []usecase.ModelBenchmark{}
	ctx, cancel := context.WithTimeout(ctx, 4*time.Minute)
	defer cancel()
	err := c.doJSONWith(ctx, c.patient, "/v1/benchmark", struct{}{}, &out)
	return out, err
}
