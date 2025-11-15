# 🏗️ Project Architecture & Deployment Structure

## 📂 Repository Structure

```
C:\Projects\fitfindr\                    ← Git repository root
│
├── 📄 README.md                         ← Root README
├── 📄 package-lock.json                 ← Root package lock
│
├── 🔧 vercel.json                       ← Vercel configuration (NEW)
├── 📘 QUICK-FIX.md                      ← Quick reference (NEW)
├── 📘 VERCEL-404-FIX.md                 ← Detailed guide (NEW)
├── 📘 DEPLOYMENT-CHECKLIST.md           ← Checklist (NEW)
├── 📘 README-VERCEL-FIX.md              ← Complete solution (NEW)
└── 📘 ARCHITECTURE.md                   ← This file (NEW)
│
└── 📁 fitfindr/                         ← ⚠️ ACTUAL NEXT.JS APP IS HERE
    │
    ├── 📦 package.json                  ← Next.js dependencies
    ├── 📦 package-lock.json
    ├── ⚙️ next.config.ts                ← Next.js configuration
    ├── ⚙️ tsconfig.json                 ← TypeScript configuration
    ├── ⚙️ tailwind.config.ts            ← Tailwind CSS config
    ├── ⚙️ postcss.config.mjs
    ├── ⚙️ eslint.config.mjs
    │
    ├── 🔐 env.production                ← Production environment variables
    ├── 🧪 test-production.mjs           ← Environment tester (NEW)
    │
    ├── 🗄️ docker-compose.yml            ← Local PostgreSQL setup
    │
    ├── 📁 prisma/                       ← Database schema & migrations
    │   ├── schema.prisma
    │   ├── seed.ts
    │   └── migrations/
    │
    ├── 📁 src/                          ← Application source code
    │   ├── 📁 app/                      ← Next.js App Router
    │   │   ├── page.tsx                 ← Homepage
    │   │   ├── layout.tsx               ← Root layout
    │   │   ├── globals.css
    │   │   │
    │   │   ├── 📁 api/
    │   │   │   └── auth/
    │   │   │       └── [...nextauth]/
    │   │   │           └── route.ts     ← NextAuth API
    │   │   │
    │   │   ├── 📁 locations/
    │   │   │   ├── page.tsx             ← Locations list
    │   │   │   ├── new/
    │   │   │   │   └── page.tsx         ← Create location
    │   │   │   └── [id]/
    │   │   │       └── page.tsx         ← Location detail
    │   │   │
    │   │   ├── 📁 events/
    │   │   │   ├── page.tsx             ← Events list
    │   │   │   ├── new/
    │   │   │   │   └── page.tsx         ← Create event
    │   │   │   └── [id]/
    │   │   │       └── page.tsx         ← Event detail
    │   │   │
    │   │   └── 📁 auth/
    │   │       ├── login/
    │   │       │   └── page.tsx         ← Login page
    │   │       └── register/
    │   │           └── page.tsx         ← Register page
    │   │
    │   ├── 📁 components/               ← React components
    │   │   ├── auth/
    │   │   ├── events/
    │   │   ├── locations/
    │   │   ├── maps/
    │   │   ├── reviews/
    │   │   ├── voting/
    │   │   ├── layout/
    │   │   └── ui/
    │   │
    │   ├── 📁 lib/                      ← Utility libraries
    │   │   ├── auth.ts                  ← NextAuth configuration
    │   │   ├── prisma.ts                ← Prisma client
    │   │   ├── session.ts               ← Session helpers
    │   │   ├── geocoding.ts             ← Geocoding utilities
    │   │   ├── validators.ts            ← Zod schemas
    │   │   └── utils.ts
    │   │
    │   ├── 📁 actions/                  ← Server actions
    │   │   ├── auth-actions.ts
    │   │   ├── location-actions.ts
    │   │   ├── event-actions.ts
    │   │   ├── review-actions.ts
    │   │   └── vote-actions.ts
    │   │
    │   └── 📁 types/                    ← TypeScript types
    │       └── next-auth.d.ts
    │
    ├── 📁 public/                       ← Static assets
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── ...
    │
    └── 📁 scripts/                      ← Utility scripts
        └── re-geocode-locations.ts
```

---

## 🔄 Deployment Flow

### ❌ Current Issue (404 Error)

```
Vercel Deployment
┌─────────────────────────────────────────────────┐
│ Repository Root: /                              │
│                                                  │
│ Vercel looks here for Next.js app:              │
│   ❌ /package.json         (not found)          │
│   ❌ /next.config.ts       (not found)          │
│   ❌ /src/                 (not found)          │
│                                                  │
│ Result: 404 Not Found                           │
└─────────────────────────────────────────────────┘
```

### ✅ After Fix (Working)

```
Vercel Deployment
┌─────────────────────────────────────────────────┐
│ Repository Root: /                              │
│ Root Directory Setting: fitfindr/               │
│                                                  │
│ Vercel looks here for Next.js app:              │
│   ✅ /fitfindr/package.json      (found!)       │
│   ✅ /fitfindr/next.config.ts    (found!)       │
│   ✅ /fitfindr/src/              (found!)       │
│                                                  │
│ Result: App deploys successfully! 🎉            │
└─────────────────────────────────────────────────┘
```

---

## 🌐 Application Routes

### Public Routes (No Authentication Required)

```
/                          → Homepage (featured locations & events)
/locations                 → Browse all locations
/locations?q=seattle       → Search locations by city
/locations?category=GYM    → Filter by category
/locations/[id]            → Location detail page
/events                    → Browse all events
/events/[id]               → Event detail page
/auth/login                → Login page
/auth/register             → Register page
```

### Protected Routes (Authentication Required)

```
/locations/new             → Create new location
/events/new                → Create new event
```

### API Routes

```
/api/auth/[...nextauth]    → NextAuth authentication endpoints
  ├── GET  /api/auth/signin
  ├── POST /api/auth/signin
  ├── GET  /api/auth/signout
  ├── POST /api/auth/signout
  ├── GET  /api/auth/session
  └── GET  /api/auth/csrf
```

---

## 🗄️ Database Schema

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │──┐
│ email       │  │
│ name        │  │
│ passwordHash│  │
└─────────────┘  │
                 │
       ┌─────────┴─────────┐
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  Location   │     │    Event    │
├─────────────┤     ├─────────────┤
│ id          │◄────│ locationId  │
│ name        │     │ title       │
│ category    │     │ eventType   │
│ address     │     │ startDate   │
│ latitude    │     │ endDate     │
│ longitude   │     └─────────────┘
│ createdBy   │            │
└─────────────┘            │
       │                   │
       ├───────────────────┤
       │                   │
       ▼                   ▼
┌──────────────┐    ┌──────────────┐
│LocationReview│    │ EventReview  │
├──────────────┤    ├──────────────┤
│ rating       │    │ rating       │
│ comment      │    │ comment      │
└──────────────┘    └──────────────┘
       │                   │
       ▼                   ▼
┌──────────────┐    ┌──────────────┐
│LocationVote  │    │  EventVote   │
├──────────────┤    ├──────────────┤
│ voteType     │    │ voteType     │
│ (UP/DOWN)    │    │ (UP/DOWN)    │
└──────────────┘    └──────────────┘
```

---

## 🔐 Authentication Flow

```
User Registration
┌──────────────────────────────────────────────┐
│ 1. User fills registration form              │
│    /auth/register                            │
│                                              │
│ 2. Server action: registerAction()           │
│    - Validates email & password              │
│    - Hashes password with bcrypt             │
│    - Creates user in database                │
│                                              │
│ 3. Redirects to login page                   │
└──────────────────────────────────────────────┘

User Login
┌──────────────────────────────────────────────┐
│ 1. User fills login form                     │
│    /auth/login                               │
│                                              │
│ 2. NextAuth CredentialsProvider              │
│    - Finds user by email                     │
│    - Compares password hash                  │
│    - Creates JWT token                       │
│                                              │
│ 3. Session stored in JWT                     │
│    - No database session needed              │
│    - Token contains user ID                  │
│                                              │
│ 4. Redirects to homepage                     │
└──────────────────────────────────────────────┘

Protected Actions
┌──────────────────────────────────────────────┐
│ 1. User attempts protected action            │
│    (create location, create event, etc.)     │
│                                              │
│ 2. getCurrentUser() checks session           │
│    - Validates JWT token                     │
│    - Returns user data or null               │
│                                              │
│ 3. If authenticated: Allow action            │
│    If not: Redirect to login                 │
└──────────────────────────────────────────────┘
```

---

## 🌍 Geocoding & Maps

```
Location Creation Flow
┌──────────────────────────────────────────────┐
│ 1. User enters address                       │
│    - Address Line 1                          │
│    - City, State, Postal Code                │
│                                              │
│ 2. Server action: createLocationAction()     │
│    - Saves location to database              │
│    - Latitude/Longitude initially null       │
│                                              │
│ 3. Background geocoding (optional)           │
│    - Uses Nominatim API (OpenStreetMap)      │
│    - Converts address → coordinates          │
│    - Updates location with lat/lng           │
│                                              │
│ 4. Map display                               │
│    - Uses Leaflet + React Leaflet            │
│    - Shows marker at coordinates             │
│    - Falls back to address text if no coords │
└──────────────────────────────────────────────┘

Search by Location
┌──────────────────────────────────────────────┐
│ 1. User searches for "Seattle"               │
│                                              │
│ 2. Geocode search term                       │
│    - "Seattle" → (47.6062, -122.3321)        │
│                                              │
│ 3. Calculate distances                       │
│    - Haversine formula                       │
│    - Filter by radius (default 25 miles)     │
│                                              │
│ 4. Return nearby locations                   │
│    - Sorted by distance                      │
└──────────────────────────────────────────────┘
```

---

## 🚀 Build & Deployment Process

### Local Development

```bash
1. Start PostgreSQL
   npm run docker:up

2. Run migrations
   npx prisma migrate dev

3. Seed database
   npm run db:seed

4. Start dev server
   npm run dev

5. Visit http://localhost:3000
```

### Production Deployment (Vercel)

```bash
1. Push to GitHub
   git push origin main

2. Vercel auto-deploys
   - Detects Next.js framework
   - Runs: npm install
   - Runs: npm run build
   - Runs: npx prisma generate

3. Set environment variables in Vercel
   - DATABASE_URL
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET

4. Run migrations
   vercel env pull .env.production
   npx prisma migrate deploy

5. Visit production URL
   https://fitfindr-six.vercel.app
```

---

## 📊 Tech Stack Summary

### Frontend
- **Framework:** Next.js 16.0.3 (App Router)
- **React:** 19.2.0
- **Styling:** Tailwind CSS 3.4.13
- **Icons:** Lucide React 0.447.0
- **Maps:** Leaflet 1.9.4 + React Leaflet 5.0.0

### Backend
- **Runtime:** Node.js 20+
- **Database:** PostgreSQL
- **ORM:** Prisma 6.2.1
- **Authentication:** NextAuth 4.24.7
- **Password Hashing:** bcryptjs 2.4.3
- **Validation:** Zod 3.23.8

### Deployment
- **Platform:** Vercel
- **Database Host:** Prisma Accelerate
- **CI/CD:** GitHub → Vercel (auto-deploy)

---

## 🔧 Configuration Files

### vercel.json (Root)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd fitfindr && npm install && npm run build",
  "devCommand": "cd fitfindr && npm run dev",
  "installCommand": "cd fitfindr && npm install",
  "outputDirectory": "fitfindr/.next"
}
```

### next.config.ts (fitfindr/)
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### Environment Variables
```bash
# Production (Vercel)
DATABASE_URL="postgres://..."
NEXTAUTH_URL="https://fitfindr-six.vercel.app"
NEXTAUTH_SECRET="..."

# Local Development
DATABASE_URL="postgresql://fitfindr:fitfindr@localhost:5432/fitfindr"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-dev-secret"
```

---

## 📝 Summary

**Key Points:**
1. ✅ Next.js app is in `fitfindr/` subdirectory
2. ✅ Vercel needs Root Directory set to `fitfindr`
3. ✅ Database uses PostgreSQL with Prisma ORM
4. ✅ Authentication uses NextAuth with JWT strategy
5. ✅ Maps use Leaflet with OpenStreetMap geocoding

**The Fix:**
- Set Root Directory to `fitfindr` in Vercel Settings
- Or use the provided `vercel.json` configuration

---

**Last Updated:** November 15, 2025

