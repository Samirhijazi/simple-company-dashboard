# Client Requests Dashboard

A minimal internal dashboard for tracking client requests through a simple
status flow: **New → In Progress → Done**.

Built as a full-stack take-home: a React (Vite) frontend and a Node/Express
backend backed by SQLite, kept in separate folders with a clear API boundary
between them.

```
client-dashboard/
├── backend/     Express REST API + SQLite database
└── frontend/    React (Vite) single-page app
```

## Features

- **Login page** — mock authentication (no real user store; any email +
  password logs you in). Simulates a real login flow: form validation,
  loading state, token stored client-side, protected dashboard route.
- **Dashboard** — table of client requests with client name, description,
  status badge, and created date.
- **Create request** — inline form adds a new request with status `New`.
- **Advance status** — button cycles each request `New → In Progress → Done`.
  The status flow is enforced on the **server**, not just the UI, so the API
  can't be pushed into an invalid state.

## Tech choices (and why)

| Layer    | Choice                    | Why                                                                                                                                                                   |
| -------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend | React + Vite              | Fast dev server, minimal config, standard for a small SPA                                                                                                             |
| Routing  | react-router-dom          | Login / protected dashboard route separation                                                                                                                          |
| HTTP     | axios                     | Small, clear interceptor for attaching the mock token                                                                                                                 |
| Backend  | Node.js + Express         | Minimal REST API, easy to read                                                                                                                                        |
| Database | SQLite (`better-sqlite3`) | Zero setup (single file, no server to install), synchronous API keeps route code simple. Swappable for Postgres later since all SQL lives in `models/requestModel.js` |

## Getting started

You'll need **Node.js 18+** installed.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # optional, defaults to PORT=4004
npm run dev             # or: npm start
```

The API starts on `http://localhost:4004`. On first run it creates
`backend/db/dashboard.db` and seeds it with a few example requests.

Health check: `GET http://localhost:4004/api/health`

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env   # optional, defaults to http://localhost:4004/api
npm run dev
```

Open `http://localhost:5173`. Log in with any email/password, e.g.
`you@company.com` / `anything`.

## API reference

Base URL: `http://localhost:4004/api`

| Method | Endpoint               | Body                           | Description                                                                                                     |
| ------ | ---------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| POST   | `/auth/login`          | `{ email, password }`          | Mock login, returns `{ token, user }`                                                                           |
| GET    | `/requests`            | —                              | List all client requests                                                                                        |
| POST   | `/requests`            | `{ client_name, description }` | Create a request (status starts as `New`)                                                                       |
| PATCH  | `/requests/:id/status` | `{}` or `{ status: "Done" }`   | With no body, advances one step in the flow. With a body, jumps directly to that status (validated server-side) |

Example:

```bash
curl -X POST http://localhost:4004/api/requests \
  -H "Content-Type: application/json" \
  -d '{"client_name":"Acme Corp","description":"Reset API keys"}'

curl -X PATCH http://localhost:4004/api/requests/1/status
```

## Project structure

```
backend/
├── db/
│   └── db.js              # SQLite connection + schema + seed data
├── models/
│   └── requestModel.js     # All SQL lives here (data access layer)
├── routes/
│   ├── auth.js              # Mock login route
│   └── requests.js          # CRUD routes for client requests
└── server.js                 # Express app setup, middleware, error handling

frontend/
├── src/
│   ├── api/client.js         # Single axios instance + typed API calls
│   ├── context/AuthContext.jsx   # Mock auth state (login/logout, token in localStorage)
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   ├── NewRequestForm.jsx
│   │   └── RequestTable.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx                # Routes
│   └── main.jsx                # Entry point
```

## Design notes / production thinking

- **Separation of concerns**: routes only handle HTTP; SQL lives in
  `requestModel.js`; the frontend only talks to the backend through
  `api/client.js`. Swapping the database or adding a real auth provider
  wouldn't touch UI components.
- **Server-enforced state machine**: the status flow (`New → In Progress →
Done`) is validated in `requestModel.js`, not just disabled buttons in the
  UI, so the API itself refuses invalid status values.
- **Optimistic-ish UI**: create/advance actions show per-row loading state
  and only update local state once the server confirms the change, avoiding
  UI/DB drift.

## Running with Docker

Both services are containerized. From the project root:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173` (built as a static bundle, served by nginx)
- Backend: `http://localhost:4004`

The SQLite file is persisted in a named Docker volume (`backend_db`), so data
survives container rebuilts. To reset it: `docker compose down -v`.

**Notes on the setup:**

- The backend uses a multi-stage build: one stage compiles `better-sqlite3`'s
  native addon (needs `python3`/`make`/`g++`), the final image only ships the
  compiled output — keeps the runtime image slim and free of build tools.
- The frontend is built as static files and served by nginx rather than
  running the Vite dev server in production. `VITE_API_URL` is passed as a
  Docker build ARG since Vite bakes env vars into the bundle at build time,
  not at runtime.
- `nginx.conf` includes a `try_files` fallback so client-side routes (like
  refreshing on `/dashboard`) don't 404.

To run just one service:

```bash
docker compose up backend
docker compose up frontend
```

## Next steps for a real production version

- Real authentication (JWT/session) with a users table and hashed passwords
- Pagination / filtering on `GET /requests` once the table grows
- Optimistic UI updates with rollback on failure
- Swap SQLite for Postgres and add migrations (e.g. via Prisma or Knex)
- Tests: API integration tests (supertest) and component tests (React
  Testing Library)
