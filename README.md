# MicroTwitter (Twitter-like microblog)

A full-stack microblogging app (Twitter-like) with:
- **Backend:** Node.js, Express, Prisma (MVC)
- **Database:** Postgres (Supabase)
- **Frontend:** React + React Router + CSS Modules
- **Auth:** JWT (Bearer token)
- **Deploy:** Backend on Fly.io, Frontend on Netlify

## Features
- Signup / login
- Create posts
- Follow / unfollow users
- Feed shows posts from users you follow + your own posts
- User profile with posts + followers/following

---

## Repo structure
- backend/ 
    - Express + Prisma API
    - Prisma ORM
    - Auth, posts, follows, feed logic
- frontend/ 
    - React SPA
    - Routes, pages, API calls, CSS modules

---

## Prerequisites
- Node.js **22.12+**
- npm
- (Optional) Docker if you want to run via containers

---

## Environment variables

### Backend (`backend/.env`)
Create `backend/.env`:

```
DATABASE_URL="YOUR_SUPABASE_POSTGRES_CONNECTION_STRING"
JWT_SECRET="YOUR_LONG_RANDOM_SECRET"
PORT=8080
```

Do not commit .env.

### Frontend (frontend/.env)

Create frontend/.env:
```
VITE_API_URL=http://localhost:8080
```

## Run locally

### Backend
```
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```
Backend runs at http://localhost:8080

### Frontend
```
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

### API overview (key endpoints)

- POST /auth/signup

- POST /auth/login

- GET /auth/me (protected)

- POST /posts (protected)

- GET /users/:id/posts

- POST /follows/:userId (protected)

- DELETE /follows/:userId (protected)

- GET /users/:id/followers

- GET /users/:id/following

- GET /feed (protected)

### Deployment

- Backend: Fly.io

- Frontend: Netlify

### Live links:

- Frontend: https://microtwitter.netlify.app

- Backend: https://backend-spring-star-1738.fly.dev
