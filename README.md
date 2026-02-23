# WellVantage

Gym management platform

## Tech Stack **`apps/backend`** 
- NestJS API 
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

---
## Swagger API Docs:

 `http://localhost:3001/api/docs`


---
## API cURL examples

Base URL: `http://localhost:3001/api`. Replace `YOUR_ACCESS_TOKEN` with the JWT from Google login or refresh. Replace `PLAN_ID` placeholders with real IDs from responses.

### Auth

```bash
# Start Google OAuth (open in browser; callback returns access_token + refresh_token)
open http://localhost:3001/api/auth/google
in browser, if getting CORS error, disable below code for local testing under main.ts
# app.enableCors({ origin: config.get('CORS_ORIGIN', 'http://localhost:3000'), credentials: true });

curl --location 'http://localhost:3001/api/auth/google'

```

### Workout plans

```bash
# Create
curl --location 'http://localhost:3001/api/workout-plans' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <Your Token>' \
--data '{
  "title": "Beginner'\''s workout - 1 Days ",
  "duration": 1,
  "description": "Random test 1",
  "days": [
    {
      "dayName": "Chest",
      "orderIndex": 0,
      "exercises": [
        {
          "exerciseName": "Bench Press",
          "sets": 8,
          "reps": 3
        }
      ]
    }
  ]
}'
```
#### RESPONSE:

<img width="897" height="643" alt="image" src="https://github.com/user-attachments/assets/c72c5a18-dd55-417b-9069-8924e9150fd3" />


```bash
# List plans
curl -X GET http://localhost:3001/api/workout-plans \
--header "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get one plan
curl -X GET http://localhost:3001/api/workout-plans/PLAN_ID \
--header "Authorization: Bearer YOUR_ACCESS_TOKEN"

```
#### RESPONSE:

<img width="899" height="645" alt="image" src="https://github.com/user-attachments/assets/35b90e52-e0f0-4c56-a043-58dc67a63b88" />



### Availability

```bash
# Create availability
curl --location 'http://localhost:3001/api/availability' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
--data '{
  "date": "2024-07-24",
  "startTime": "2024-07-24T08:30:00.000Z",
  "endTime": "2024-07-24T11:00:00.000Z",
  "repeatSession": false,
  "repeatUntilDate": "2025-02-06",
  "sessionName": "PT"
}'
```
#### RESPONSE:

<img width="907" height="397" alt="image" src="https://github.com/user-attachments/assets/7d3e5e6f-0d5c-43ae-b4a7-395feb51866e" />

```bash
# List open slots
curl -X GET "http://localhost:3001/api/availability/open?from=2025-02-01&to=2025-03-31" \
--header "Authorization: Bearer YOUR_ACCESS_TOKEN"

# List availability
curl -X GET http://localhost:3001/api/availability \
--header "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Bookings

```bash
# Create booking
curl --location 'http://localhost:3001/api/bookings' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
--data '{
  "selectedDate": "2024-07-24T00:00:00.000Z",
      "availabilityId": "2c435fe9-516d-4c68-b75c-67153ba06a5d",
    "startTime": "2024-07-24T08:30:00.000Z",
    "endTime": "2024-07-24T11:00:00.000Z"
}'
```
#### RESPONSE:

<img width="904" height="621" alt="image" src="https://github.com/user-attachments/assets/3fc68ebe-81be-4dc8-813d-dd5011bc44c4" />


```bash
# List my bookings
curl --location 'http://localhost:3001/api/bookings' \
--header 'accept: */*' \
--header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```
