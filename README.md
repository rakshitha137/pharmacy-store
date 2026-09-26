# CareRx Pharmacy Store (MVP)

React + Vite storefront with an **Express + MongoDB (Mongoose) API** under `server/`.  
In development the app calls **`/api`**, which Vite proxies to **`http://localhost:4000`** (see `vite.config.js`).

If `.env` is missing or `VITE_API_BASE_URL` is empty, the UI keeps working with **mock catalog + local-only auth**.

## Prereqs

- Node.js **18+** (20 LTS recommended)
- npm **9+**
- **MongoDB** (local `mongod` or Atlas)

## Install

```bash
cd pharmacy-store
npm install
```

## Configure MongoDB

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | Mongo connection string (server only), e.g. `mongodb://127.0.0.1:27017/pharmacy` |
| `JWT_SECRET` | **Required** for auth API — long random string |
| `PORT` | API port (default `4000`) |
| `CLIENT_ORIGIN` | Allowed browser origin(s), e.g. `http://localhost:5173` |
| `VITE_API_BASE_URL` | Use `/api` in dev (proxy). For production build, set full URL before `npm run build`. |

Seed the catalog into MongoDB:

```bash
npm run seed
```

## Run (development)

**API + Vite together:**

```bash
npm run dev:stack
```

Or two terminals:

```bash
npm run server
npm run dev
```

- Storefront: `http://localhost:5173`  
- API health: `http://localhost:4000/api/health`

## Build (production SPA)

```bash
npm run build
npm run preview
```

Set `VITE_API_BASE_URL` to your **deployed API base** (e.g. `https://api.example.com/api`) **before** `npm run build`. Run the API with the same `.env` pattern on your host (`npm run server`).

## API contract (used by `src/services`)

- `GET /api/products?category=&q=` → `{ data: Product[] }`
- `GET /api/products/:slug` → `{ data: Product }`
- `POST /api/auth/signup` body `{ name, email, password }` → `{ data: { user, token } }`
- `POST /api/auth/login` body `{ email, password }` → `{ data: { user, token } }`

## Features

- Home, products (filters + search), product detail
- Cart in **LocalStorage**
- Sign up / sign in → **MongoDB** + **JWT** when API is used
- Dark mode, mobile sidebar, toasts
- Custom CSS only (no Bootstrap / MUI)

## Layout

```
pharmacy-store/
  server/
    index.js          # Express app + Mongo connect
    seed.js           # npm run seed
    data/seedCatalog.js
    models/
    routes/
  src/
    ...
```

## Notes

- Product images use remote URLs; swap for your CDN when going live.
- Demo only — not a licensed pharmacy.
