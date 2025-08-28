# Task Manager Backend (Node.js + TypeScript + MongoDB)

A production-grade backend for a Task Management app built with **Express**, **TypeScript**, **MongoDB (Mongoose)**, **JWT Auth**, and **Socket.IO** for optional realtime updates.

## Features
- User registration & login (JWT based)
- Protected task CRUD (user scoped)
- Validation with Zod
- Pagination, filtering (by status), search, sorting
- Central error handling & typed errors
- Security (helmet, CORS, rate-limiter, mongo-sanitize, xss-clean)
- Optional refresh tokens
- Optional realtime updates via Socket.IO (JWT-authenticated sockets)
- Docker & docker-compose (MongoDB + App)
- Jest + Supertest integration tests (auth & tasks)

## Quick Start

```bash
# 1. Install deps
npm i

# 2. Copy env
cp .env.example .env

# 3. Start MongoDB (Docker) or use local Mongo
docker compose up -d  # optional

# 4. Dev
npm run dev

# 5. Build & start
npm run build && npm start
```

### ENV
See `.env.example`.

### API (Base URL: `http://localhost:4000/api`)
Auth:
- `POST /auth/register` { username, email, password }
- `POST /auth/login` { email, password } → { accessToken, refreshToken }
- `POST /auth/refresh` { refreshToken } (optional)
- `POST /auth/logout` (optional; client just discards tokens)

Tasks (requires `Authorization: Bearer <accessToken>`):
- `POST /tasks` { title, description?, status? }
- `GET /tasks` ?status=pending|completed&search=...&page=1&limit=10&sortBy=createdAt|updatedAt&sortOrder=asc|desc
- `GET /tasks/:id`
- `PATCH /tasks/:id` { title?, description?, status? }
- `DELETE /tasks/:id`

### Testing
```bash
npm test
```

### Realtime (optional)
- Server emits events: `task:created|updated|deleted`
- Clients connect with `io('...', { auth: { token: 'Bearer <accessToken>' }})`

### Docker
```bash
docker compose up -d
```

### Notes
- This repo focuses on **backend only** per assessment scope.
- Angular frontend can be added later to consume the above APIs.
