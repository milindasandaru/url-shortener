# URL Shortener

A minimal URL shortener built with Node.js, Express, and SQLite. It exposes a simple API to shorten URLs and redirect users via short codes.

## Features

- Shorten any valid URL into a 6-character code (using nanoid)
- Redirect short code to original URL (302)
- Validation with Zod (proper error messages for invalid input)
- SQLite persistence (file-based by default, in-memory for tests)
- Health check endpoint

## Project structure

```
.
├─ src/
│  ├─ index.js       # Server entry (starts Express)
│  ├─ app.js         # Express app and middleware
│  ├─ db.js          # SQLite init (file or :memory:)
│  ├─ repo/
│  │  └─ urlRepo.js  # Data access (create, find by code)
│  └─ routes/
│     └─ urlRoutes.js # /shorten and /:code
├─ data/
│  └─ urls.db        # SQLite DB file (created at runtime)
├─ tests/
│  └─ app.test.js    # Jest tests
└─ package.json
```

## Requirements

- Node.js (LTS or current)
- npm

## Install

```bash
npm install
```

## Run

- Default port: 3000
- If 3000 is in use, set a different `PORT`.

Examples:

- Unix/macOS
  ```bash
  npm run dev
  # or specify a port
  PORT=3100 PUBLIC_BASE_URL="http://localhost:3100" npm run start
  ```

- Windows PowerShell
  ```powershell
  npm run dev
  # or specify a port and base URL
  $env:PORT=3100; $env:PUBLIC_BASE_URL="http://localhost:3100"; npm run start
  ```

When running, you should see:

```
Server running on http://localhost:<PORT>
```

## Environment variables

- `PORT` (optional): HTTP port (default `3000`).
- `PUBLIC_BASE_URL` (recommended): Base URL used in responses (e.g., `http://localhost:3000`). If not set, it falls back to `PUBLIC_BASIC_URL` then `http://localhost:<PORT>`.
- `PUBLIC_BASIC_URL` (legacy): Same purpose as `PUBLIC_BASE_URL` for backward compatibility.
- `DB_IN_MEMORY` (tests/dev): When set to `true`, uses an in-memory SQLite DB (not persisted to disk). Default is file-based at `data/urls.db`.

## API

### Health

- `GET /health`
- Response: `{ "ok": true }`

### Shorten

- `POST /shorten`
- Body (JSON):
  ```json
  { "url": "https://example.com" }
  ```
- Response (200):
  ```json
  { "shortUrl": "http://localhost:3000/AbC123", "code": "AbC123" }
  ```
- Errors:
  - 400: Invalid URL format
  - 409: Code already exists (extremely rare with random IDs)
  - 500: Server error

### Redirect

- `GET /:code`
- Behavior: 302 redirect to original URL
- Errors:
  - 404: Unknown code

## Examples

Using curl:

```bash
# Health
curl -s http://localhost:3000/health

# Create short URL
curl -s -X POST http://localhost:3000/shorten \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com"}'
# => {"shortUrl":"http://localhost:3000/AbC123","code":"AbC123"}

# Inspect redirect (no follow)
curl -sI http://localhost:3000/AbC123 | grep -i location
# => Location: https://example.com
```

PowerShell (no follow redirects):

```powershell
try {
  $resp = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:3000/AbC123" -MaximumRedirection 0 -ErrorAction Stop
} catch { $resp = $_.Exception.Response }
$resp.StatusCode
$resp.Headers.Location
```

## Persistence

- When `DB_IN_MEMORY` is not `true`, the app persists data to `data/urls.db` (created automatically).
- To reset locally, stop the server and delete `data/urls.db`.

## Development

- Start in watch mode:
  ```bash
  npm run dev
  ```

- Run tests:
  ```bash
  npm test
  ```

## Notes

- Short codes are 6 characters (A–Z, a–z, 0–9, `_`, `-`).
- The project uses CommonJS (`type: "commonjs"`).
- For production behind a reverse proxy, set `PUBLIC_BASE_URL` to your external URL (e.g., `https://short.domain.tld`).

---

MIT ©
