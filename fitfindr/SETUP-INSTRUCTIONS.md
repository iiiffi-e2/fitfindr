# 🚀 Quick Setup Instructions

## What's Been Configured

✅ Docker Compose file created for local PostgreSQL  
✅ Prisma schema updated to use PostgreSQL  
✅ `.env` file created with database connection  
✅ Package.json updated with helper scripts  
✅ Comprehensive deployment guide created  

## Next Steps - Start Here! 👇

### 1. Start Docker Desktop

**IMPORTANT:** You need to start Docker Desktop before continuing.

1. Open Docker Desktop from your Start menu
2. Wait until you see "Docker Desktop is running" in the system tray
3. This usually takes 30-60 seconds

### 2. Start PostgreSQL Database

Once Docker Desktop is running, open PowerShell in this directory and run:

```powershell
npm run docker:up
```

You should see output like:
```
✔ Container fitfindr-postgres  Started
```

### 3. Run Database Migrations

Wait 5 seconds for PostgreSQL to fully start, then run:

```powershell
npx prisma migrate deploy
```

This will create all the database tables.

### 4. Seed Demo Data (Optional)

Add demo users, locations, and events:

```powershell
npx prisma db seed
```

Demo credentials:
- Email: demo@fitfindr.com
- Password: password123

### 5. Start Development Server

```powershell
npm run dev
```

Visit http://localhost:3000 🎉

---

## Daily Workflow

Every time you want to work on the project:

```powershell
# 1. Make sure Docker Desktop is running (check system tray)

# 2. Start PostgreSQL (if not already running)
npm run docker:up

# 3. Start Next.js
npm run dev
```

When you're done (optional):
```powershell
npm run docker:down
```

---

## Helpful Commands

```powershell
# View PostgreSQL logs
npm run docker:logs

# Check if PostgreSQL is running
docker ps

# Stop PostgreSQL
npm run docker:down

# Generate a new secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Troubleshooting

### "Docker daemon is not running"
→ Start Docker Desktop and wait for it to fully start

### "Port 5432 already in use"
→ Another PostgreSQL is running. Stop it or change the port in docker-compose.yml

### "Can't connect to database"
→ Wait 10 seconds after `docker:up` and try again

---

## Ready to Deploy?

See **DEPLOYMENT.md** for complete production deployment instructions for Vercel.

Quick summary:
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET)
4. Deploy
5. Run migrations with Vercel CLI

---

## Environment Variables

Your local `.env` file is configured with:
- `DATABASE_URL` - PostgreSQL connection on port **5434** (to avoid conflict with any existing PostgreSQL on port 5432)
- `NEXTAUTH_URL` - Local development URL
- `NEXTAUTH_SECRET` - Generated secret

For production, you'll need to set these in Vercel with production values (using standard port 5432).

