# JK Autos

JK Autos is a full-stack premium car dealership platform for luxury and everyday vehicles in Nigeria. It includes public inventory browsing, car details, comparison, auth, user dashboards, admin inventory management, bookings, inquiries, installments, Supabase-ready data storage, and Supabase Storage image uploads.

## Tech Stack

- Frontend: React.js with Vite
- Backend: Node.js and Express.js
- Database: Supabase PostgreSQL
- Auth: JWT and bcrypt
- File upload: Supabase Storage
- Styling: Tailwind CSS and custom CSS
- HTTP: Axios
- Charts: Recharts
- Notifications: react-hot-toast
- Icons: Lucide React
- Dates: date-fns
- Carousel: Swiper
- Animation: AOS

## Features

- Cinematic dark JK Autos landing page with Orbitron typography, racing red accents, brand strip, featured vehicles, body-type browsing, testimonials, CTA, newsletter, and installment cards.
- Inventory page with URL-synced filters, sort, grid/list view, active filter chips, pagination, loading skeletons, and empty states.
- Car detail page with Swiper gallery, thumbnails, video modal, specs, features, reviews, installment calculator, save/compare/share/print actions, call and WhatsApp CTA.
- Smart search with suggestions, popular searches, and recent searches in localStorage.
- Compare up to 3 vehicles with highlighted spec values.
- User dashboard for saved cars, inspections, test drives, installments, recently viewed cars, messages, and profile.
- Admin dashboard with stats, Recharts charts, inventory table, add/edit car multi-step form, inspections, test drives, inquiries, customers, sales export, and installment settings.
- Supabase schema and seed data for 20 sample cars, users, installment plans, inspections, messages, and reviews.
- Local in-memory API fallback when Supabase credentials are placeholders.

## Folder Structure

```txt
jkautos/
  client/
    src/components/
    src/context/
    src/hooks/
    src/pages/
    src/services/
    src/utils/
  server/
    config/
    controllers/
    data/
    middleware/
    routes/
    supabase/
    utils/
```

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor and run `server/supabase/schema.sql`.
3. Create public Storage buckets:
   - `car-images`
   - `profile-images`
4. Copy your Supabase URL, anon key, and service role key into the env files.
5. From `server/`, run:

```bash
npm run seed
```

## Environment Variables

`server/.env`

```env
PORT=5000
JWT_SECRET=jkautos_secret_2024
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLIENT_URL=http://localhost:5173
```

`client/.env`

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000/api
```

## Run Locally

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## Default Credentials

- Admin: `admin@jkautos.com` / `Admin@12345`
- User 1: `user1@jkautos.com` / `User@12345`
- User 2: `user2@jkautos.com` / `User@12345`
- User 3: `user3@jkautos.com` / `User@12345`

## Deploy

Render backend:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Add production env vars from `server/.env.example`
- Set `CLIENT_URL` to the Vercel frontend URL

Vercel frontend:

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Add production env vars from `client/.env.example`
- Set `VITE_API_URL` to the Render API URL plus `/api`

## Contact

- WhatsApp: +234 8121638903
- Phone: +234 8121638903
