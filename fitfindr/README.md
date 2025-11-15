# fitfindr — find your fitness

fitfindr is a mobile-first directory of nearby fitness locations and events. Browse gyms, yoga studios, tracks, and pickup games, or add new spots and classes when you're logged in.

## Tech stack

- Next.js 16 (App Router, Server Components)
- TypeScript + Tailwind CSS
- Prisma ORM with SQLite (ready for Postgres later)
- NextAuth (credentials provider) + bcrypt hashing

## Getting started

```bash
npm install

# Apply Prisma schema + generate client
npm run db:migrate

# Seed demo data (users, locations, events)
npm run db:seed

# Start the dev server
npm run dev
```

Visit http://localhost:3000 — the UI is responsive out of the box.

### Demo credentials

- **Email:** demo@fitfindr.com  
- **Password:** password123

Use the demo account (or register your own) to add new locations and events.

## Project structure

- `src/app` — App Router routes for home, locations, events, and auth flows
- `src/actions` — server actions for auth and create flows
- `src/components` — reusable UI, forms, and layout pieces
- `src/lib` — Prisma client, auth config, helpers, and validators
- `prisma` — data models, migrations, and seed script

## Next steps

- Swap SQLite for Postgres in production (just change `DATABASE_URL`)
- Add editing/deleting flows for creators
- Enhance search with map support and geospatial filters
