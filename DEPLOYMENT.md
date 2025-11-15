# Deployment Guide for fitfindr

## Local Development Setup

### Prerequisites
1. **Docker Desktop** - Must be installed and running
   - Download from: https://www.docker.com/products/docker-desktop/
   - **Important**: Start Docker Desktop before running the setup commands

2. **Node.js 20+** - Already installed ✓

### Quick Start

1. **Start Docker Desktop** (if not already running)
   - Look for the Docker icon in your system tray
   - Wait until it shows "Docker Desktop is running"

2. **Set up the local database:**
   ```bash
   cd fitfindr
   npm run docker:up
   ```

3. **Wait 5-10 seconds for PostgreSQL to start, then run migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Visit http://localhost:3000**

### Daily Workflow

```bash
# Start PostgreSQL (if not running)
npm run docker:up

# Start Next.js dev server
npm run dev

# When done (optional - stops the database)
npm run docker:down
```

### Useful Commands

```bash
# View PostgreSQL logs
npm run docker:logs

# Stop PostgreSQL
npm run docker:down

# Restart PostgreSQL
npm run docker:down
npm run docker:up

# Reset database (careful - deletes all data!)
npm run docker:down
docker volume rm fitfindr_postgres_data
npm run docker:up
npx prisma migrate deploy
npx prisma db seed
```

---

## Production Deployment (Vercel)

### Prerequisites
1. Vercel account (free tier available)
2. PostgreSQL database (see options below)
3. GitHub repository with your code

### Step 1: Set Up PostgreSQL Database

Choose one of these providers:

**Option A: Vercel Postgres (Recommended)**
- In your Vercel dashboard, go to Storage → Create Database → Postgres
- Copy the connection string

**Option B: Neon (Free Tier)**
- Sign up at https://neon.tech
- Create a new project
- Copy the connection string

**Option C: Supabase (Free Tier)**
- Sign up at https://supabase.com
- Create a new project
- Go to Settings → Database → Connection String
- Copy the connection string (use the "Connection Pooling" one)

### Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `fitfindr`
   - **Build Command:** (leave default)
   - **Output Directory:** (leave default)

5. Add Environment Variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

6. Click "Deploy"

### Step 4: Run Database Migrations

After first deployment, you need to set up your production database:

**Install Vercel CLI:**
```bash
npm i -g vercel
```

**Run migrations:**
```bash
vercel login
vercel link
vercel env pull .env.production
npx prisma migrate deploy
```

**Optional - Seed demo data:**
```bash
npx prisma db seed
```

### Step 5: Verify Deployment

Visit your Vercel URL and test:
- ✓ Registration/login works
- ✓ Creating locations works
- ✓ Creating events works
- ✓ Maps display correctly

---

## Environment Variables Reference

### Local Development (.env)
```bash
DATABASE_URL="postgresql://fitfindr:fitfindr@localhost:5432/fitfindr"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-secret"
```

### Production (Vercel)
```bash
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
```

---

## Troubleshooting

### "Docker daemon is not running"
- Start Docker Desktop and wait for it to fully start
- Look for the Docker icon in your system tray

### "Port 5432 already in use"
- Another PostgreSQL instance is running
- Either stop it or change the port in docker-compose.yml

### "Prisma migrate failed"
- Make sure PostgreSQL is running: `docker ps`
- Check logs: `npm run docker:logs`
- Verify DATABASE_URL in .env file

### "NEXTAUTH_SECRET is not set"
- Generate a new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- Add it to your .env file

---

## Next Steps

After deployment, consider:
- [ ] Set up a custom domain in Vercel
- [ ] Enable Vercel Analytics
- [ ] Set up database backups
- [ ] Add monitoring/error tracking (e.g., Sentry)
- [ ] Configure CORS if needed
- [ ] Set up CI/CD for automated testing

