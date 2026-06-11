# Universal Platform Backend

A reusable REST API backend built with **NestJS**, **Prisma**, and **Supabase PostgreSQL**.

Initially developed as the backend for **FitReserve** — a Fitness Studio Booking Platform — but architected to support multiple verticals through `project_id` and `company_id` scoping.

---

## Technology Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Framework        | NestJS 10 (TypeScript)              |
| ORM              | Prisma 5                            |
| Database         | Supabase (PostgreSQL)               |
| Authentication   | JWT (Access + Refresh tokens)       |
| Password hashing | Argon2                              |
| Validation       | class-validator / class-transformer |
| Documentation    | Swagger / OpenAPI                   |
| Rate limiting    | @nestjs/throttler                   |
| Security         | Helmet, CORS                        |

---

## Prerequisites

- Node.js >= 20
- npm >= 10
- A [Supabase](https://supabase.com) project (free tier works)

---

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd universal-platform-backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in:

- `DATABASE_URL` — your Supabase connection pooler URL (Settings > Database > Connection string > URI, port 6543)
- `DIRECT_URL` — your Supabase direct URL (port 5432, used for migrations)
- `JWT_ACCESS_SECRET` — a long random string (run `openssl rand -base64 64`)
- `JWT_REFRESH_SECRET` — a different long random string
- `SEED_ADMIN_PASSWORD` — password for the dev admin account
- `SEED_MEMBER_PASSWORD` — password for the dev member account

### 3. Push the database schema

```bash
npm run db:push
```

### 4. (Optional) Seed with development data

```bash
npm run db:seed
```

This creates one company, one admin user, and one member user using the credentials from your `.env`.

### 5. Start the development server

```bash
npm run start:dev
```

The API is available at `http://localhost:3000/api/v1`.
Interactive Swagger docs are available at `http://localhost:3000/api/docs`.

---

## Scripts

| Script                | Description                     |
| --------------------- | ------------------------------- |
| `npm run start:dev`   | Start in watch mode             |
| `npm run build`       | Compile TypeScript              |
| `npm run start:prod`  | Run compiled output             |
| `npm run db:push`     | Push schema changes to database |
| `npm run db:migrate`  | Create a migration file         |
| `npm run db:generate` | Regenerate Prisma client        |
| `npm run db:studio`   | Open Prisma Studio              |
| `npm run db:seed`     | Seed development data           |

---

## API Modules

| Module        | Base path               | Public          | Member                           | Admin                                 |
| ------------- | ----------------------- | --------------- | -------------------------------- | ------------------------------------- |
| Auth          | `/api/v1/auth`          | register, login | refresh, logout                  | —                                     |
| Users         | `/api/v1/users`         | —               | GET /me, PATCH /me               | GET /                                 |
| Companies     | `/api/v1/companies`     | GET, GET/:id    | —                                | POST, PATCH, DELETE                   |
| Professionals | `/api/v1/professionals` | GET, GET/:id    | —                                | POST, PATCH, DELETE                   |
| Programs      | `/api/v1/programs`      | GET, GET/:id    | —                                | POST, PATCH, DELETE                   |
| Memberships   | `/api/v1/memberships`   | GET, GET/:id    | GET /my                          | POST, PATCH, DELETE, POST /:id/assign |
| Classes       | `/api/v1/classes`       | GET, GET/:id    | —                                | POST, PATCH, DELETE                   |
| Bookings      | `/api/v1/bookings`      | —               | POST, GET /my, PATCH /:id/cancel | GET                                   |
| Settings      | `/api/v1/settings`      | GET /:companyId | —                                | PATCH /:companyId                     |

---

## Authentication

All protected routes require a `Bearer` token in the `Authorization` header.

```
Authorization: Bearer <access_token>
```

Access tokens expire in 15 minutes. Use `POST /api/v1/auth/refresh` with your refresh token to get a new access token.

---

## Multi-Project Architecture

This backend is designed to be reused across verticals:

| Project     | `project_id`  | "Professional" means |
| ----------- | ------------- | -------------------- |
| FitReserve  | `fitreserve`  | Trainer              |
| SalonBook   | `salonbook`   | Stylist              |
| MediReserve | `medireserve` | Doctor               |

Each company belongs to a `project_id`. All business entities (professionals, programs, classes, memberships) belong to a `company_id`. Filtering by `?companyId=` isolates data per tenant.

---

## License

UNLICENSED — private project.
