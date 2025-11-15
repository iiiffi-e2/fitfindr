# 🚀 fitfindr Deployment Guide

## ✅ Local Development is Ready!

Your local environment is fully configured and running. See **SETUP-COMPLETE.md** for details.

---

## Production Deployment to Vercel

### Prerequisites
- ✅ Code pushed to GitHub
- ✅ Vercel account (free tier available)
- ✅ PostgreSQL database provider account

### Step-by-Step Deployment

#### 1. Set Up Production Database

Choose one of these providers (all have free tiers):

**Option A: Neon (Recommended)**
1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`)

**Option B: Supabase**
1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to Settings → Database → Connection String
4. Copy the "Connection Pooling" string

**Option C: Vercel Postgres**
1. In Vercel dashboard → Storage → Create Database → Postgres
2. Copy the connection string

#### 2. Push to GitHub

```powershell
cd C:\Projects\fitfindr\fitfindr
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 3. Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `fitfindr`
   - **Build Command:** Leave default (`npm run build`)
   - **Output Directory:** Leave default (`.next`)

#### 4. Add Environment Variables

In the Vercel project settings, add these environment variables:

```bash
DATABASE_URL=postgresql://user:pass@host:5432/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret-here
```

**Generate NEXTAUTH_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Important:** Use your production database URL (port 5432), not the local one (port 5434)!

#### 5. Deploy

Click "Deploy" and wait for the build to complete.

#### 6. Run Database Migrations

After first deployment, set up your production database:

**Install Vercel CLI:**
```powershell
npm install -g vercel
```

**Run migrations:**
```powershell
vercel login
vercel link
vercel env pull .env.production
npx prisma migrate deploy
```

**Optional - Seed demo data:**
```powershell
npx prisma db seed
```

#### 7. Verify Deployment

Visit your Vercel URL (e.g., `https://your-app.vercel.app`) and test:
- ✅ Home page loads
- ✅ Registration works
- ✅ Login works
- ✅ Creating locations works
- ✅ Creating events works
- ✅ Maps display correctly

---

## Environment Variables Reference

### Local Development (.env)
```bash
DATABASE_URL=postgresql://fitfindr:fitfindr@localhost:5434/fitfindr
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-local-secret
```

### Production (Vercel)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/database?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret
```

---

## Common Issues & Solutions

### Issue: "Prisma Client not generated"
**Solution:** Run `npx prisma generate` locally and push the changes

### Issue: "Database connection failed" in production
**Solution:** 
- Verify DATABASE_URL is correct in Vercel
- Make sure it includes `?sslmode=require` for most providers
- Check that your database allows connections from Vercel's IP ranges

### Issue: "NEXTAUTH_SECRET is not set"
**Solution:** Generate a new secret and add it to Vercel environment variables

### Issue: Tables don't exist in production
**Solution:** Run `npx prisma migrate deploy` using Vercel CLI

---

## Post-Deployment Checklist

- [ ] Custom domain configured (optional)
- [ ] Environment variables verified
- [ ] Database migrations applied
- [ ] Test user registration and login
- [ ] Test creating locations and events
- [ ] Set up database backups
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error monitoring like Sentry (optional)

---

## Updating Your Deployment

After making changes to your code:

```powershell
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically deploy the changes.

If you changed the database schema:

```powershell
# Create migration locally
npx prisma migrate dev --name your_migration_name

# Push to GitHub
git add .
git commit -m "Database schema update"
git push origin main

# After Vercel deploys, run migrations
vercel env pull .env.production
npx prisma migrate deploy
```

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## Local vs Production Differences

| Aspect | Local | Production |
|--------|-------|------------|
| Database Port | 5434 | 5432 |
| Database Host | localhost | Cloud provider |
| Authentication | Trust | Password (SSL) |
| URL | http://localhost:3000 | https://your-app.vercel.app |
| Environment | `.env` file | Vercel dashboard |

---

Happy deploying! 🎉

