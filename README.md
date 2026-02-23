# WellVantage

WellVantage gym management platform.

## Structure

## Tech Stack **`apps/backend`** 

– NestJS API 
- Node.js 18+
- Google OAuth credentials
- Prisma
- PostgreSQL
- JWT
- Swagger

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Backend environment

```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env`:

- **DATABASE_URL** – PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/postgresql`)
- **JWT_SECRET** – Secret for JWT (min 32 characters)
- **GOOGLE_CLIENT_ID** / **GOOGLE_CLIENT_SECRET** – From [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **GOOGLE_CALLBACK_URL** – `http://localhost:3001/api/auth/google/callback` (dev)

### 3. Database

```bash
npm run db:push
# or for migrations: npm run db:migrate
```

### 4. Generate Prisma client

```bash
npm run db:generate
```

## Run

- **Backend** (API + Swagger at http://localhost:3001/api/docs):

  ```bash
  npm run backend
  ```

## API overview

| Area        | Base path           | Description                    |
|------------|---------------------|--------------------------------|
| Auth       | `/api/auth`         | Google OAuth, JWT, `GET /me`   |
| Workout    | `/api/workout-plans`| CRUD workout plans & exercises |
| Availability | `/api/availability`| Create/list/open slots         |
| Bookings   | `/api/bookings`     | Book and list bookings         |

Protected routes use **Bearer** token (JWT) from Google login response.

## Workspace scripts

- `npm run backend` – start backend dev server
- `npm run db:generate` – generate Prisma client
- `npm run db:push` – push schema to DB
- `npm run db:migrate` – run migrations
- `npm run db:studio` – open Prisma Studio
