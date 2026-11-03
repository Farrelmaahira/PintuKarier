FROM golang:1.26 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /api ./cmd/api

# Distroless non-root: tanpa shell, uid 65532 (dipakai juga di opsi mount Cloud Storage).
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /api /api
ENV PORT=8080
ENTRYPOINT ["/api"]
