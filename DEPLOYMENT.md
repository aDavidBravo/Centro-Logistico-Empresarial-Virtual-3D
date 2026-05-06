# 🚀 Deployment Guide — CLEV3D

Complete guide for running, testing, and deploying CLEV3D locally and to production.

---

## 📋 Table of Contents

1. [Local Development](#local-development)
2. [Docker Compose (Full Stack)](#docker-compose-full-stack)
3. [Backend Setup (FastAPI)](#backend-setup-fastapi)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [CI/CD Pipeline (GitHub Actions)](#cicd-pipeline-github-actions)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ Local Development

### Frontend Only (Quick Start)

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server (HMR enabled)
npm run dev
```

Open http://localhost:5173

**Note:** Frontend will use synthetic data (no backend required).

### Full Stack with Docker

See [Docker Compose](#docker-compose-full-stack) section below.

---

## 🐳 Docker Compose (Full Stack)

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum

### Start All Services

```bash
# Navigate to project root
cd centro-logistico-3d

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Services Running

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | Vite dev server (HMR) |
| **Backend** | http://localhost:8000 | FastAPI server + WebSocket |
| **Database** | localhost:5432 | PostgreSQL (credentials: clev3d/clev3d) |
| **Redis** | localhost:6379 | Cache layer (optional) |

### Access Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Reset Database

```bash
# Remove database volume (WARNING: deletes all data)
docker-compose down -v

# Restart
docker-compose up -d
```

---

## ⚙️ Backend Setup (FastAPI)

### Local Backend Only

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Copy .env
cp .env.example .env

# Run server
python main.py
```

Backend will be available at http://localhost:8000

### API Endpoints

```
GET  /                      # Root info
GET  /api/health           # Health check
GET  /api/sectors          # All sectors status
GET  /api/kpis             # KPI metrics
GET  /api/alerts           # Active alerts
WS   /ws/live              # WebSocket real-time updates
```

### Test WebSocket Connection

```bash
# Using websocat (install: cargo install websocat)
websocat ws://localhost:8000/ws/live

# Or in browser console
const ws = new WebSocket('ws://localhost:8000/ws/live');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

---

## 🌐 Frontend Deployment (Vercel)

### Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Connected**: Push repository to GitHub (already done)
3. **Get Tokens**:
   - VERCEL_TOKEN: https://vercel.com/account/tokens
   - VERCEL_ORG_ID: From Vercel dashboard
   - VERCEL_PROJECT_ID: After creating project

### Setup Steps

#### 1. Create Vercel Project

```bash
# Install Vercel CLI
npm install -g vercel

# Link to Vercel
vercel link

# This creates a new Vercel project
```

#### 2. Configure Environment

**vercel.json** (already created):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

#### 3. Deploy

```bash
# Manual deploy (dev)
vercel

# Production deploy
vercel --prod
```

#### 4. GitHub Actions Auto-Deploy

Add secrets to your GitHub repo:

1. Go to: Settings → Secrets and variables → Actions
2. Add:
   - `VERCEL_TOKEN`: Your token
   - `VERCEL_ORG_ID`: Your org ID
   - `VERCEL_PROJECT_ID`: Your project ID

**Workflow** (`.github/workflows/deploy.yml`) already configured.

Now, every push to `main` auto-deploys to Vercel!

### Custom Domain

1. In Vercel dashboard: Settings → Domains
2. Add your domain
3. Update DNS records (Vercel shows instructions)

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Workflow File

`.github/workflows/deploy.yml` includes:

1. **Build Frontend**
   - Install deps
   - TypeScript check
   - Build production
   - Upload artifacts

2. **Build Backend**
   - Install Python deps
   - Lint code
   - Build Docker image

3. **Deploy Frontend**
   - Download artifacts
   - Deploy to Vercel (production only)

4. **Tests**
   - Run build checks
   - Verify no errors

### Trigger Deployments

```bash
# Push to main = auto-deploy to Vercel
git push origin main

# PR checks run automatically
git push origin feat/my-feature
```

### View Results

1. GitHub → Actions tab
2. Click workflow run
3. View logs and status

---

## 🔐 Environment Variables

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_ENV=development
```

### Backend (backend/.env)

```env
# Server
HOST=0.0.0.0
PORT=8000
ENV=development

# Database
DATABASE_URL=postgresql://clev3d:clev3d@db:5432/clev3d

# JWT Auth
SECRET_KEY=dev-secret-key-change-in-prod
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# Redis
REDIS_URL=redis://localhost:6379/0
```

### Vercel Environment Variables

Set in Vercel dashboard (Settings → Environment Variables):

```env
VITE_API_URL=https://api.tu-domain.com
VITE_ENV=production
```

---

## 🔧 Troubleshooting

### Frontend Issues

**Port 5173 already in use**
```bash
# Kill process using port
npx kill-port 5173

# Or use different port
npm run dev -- --port 5174
```

**npm install fails with peer dependencies**
```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps
```

**Build fails with TypeScript errors**
```bash
# Check types
npm run type-check

# See detailed errors
npx tsc --noEmit
```

### Backend Issues

**Port 8000 already in use**
```bash
# Kill process
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
python main.py --port 8001
```

**Database connection error**
```bash
# Check PostgreSQL is running
docker-compose ps

# Reset database
docker-compose down -v
docker-compose up -d db
```

**WebSocket connection refused**
```bash
# Ensure backend is running
curl http://localhost:8000/api/health

# Check CORS configuration in main.py
```

### Docker Issues

**Container fails to start**
```bash
# Check logs
docker-compose logs backend

# Rebuild without cache
docker-compose up --build --no-cache
```

**Port conflicts**
```bash
# List all exposed ports
docker ps --format "table {{.Ports}}\t{{.Names}}"

# Change port mappings in docker-compose.yml
```

---

## 📊 Performance Optimization

### Frontend

```bash
# Analyze bundle size
npm run build -- --analyze

# Expected bundle: ~1.3MB (gzipped ~400KB)
```

### Backend

```bash
# Monitor memory usage
docker stats clev3d-backend

# Expected: <100MB for idle server
```

### Database

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U clev3d -d clev3d

# List tables
\dt

# Check database size
SELECT pg_size_pretty(pg_database_size('clev3d'));
```

---

## 🆘 Getting Help

1. **GitHub Issues**: https://github.com/aDavidBravo/centro-logistico-3d/issues
2. **Vercel Docs**: https://vercel.com/docs
3. **FastAPI Docs**: https://fastapi.tiangolo.com/
4. **Docker Docs**: https://docs.docker.com/

---

## 📋 Deployment Checklist

Before going to production:

- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] No console errors/warnings
- [ ] All secrets in Vercel
- [ ] CORS configured correctly
- [ ] Database migrations run
- [ ] WebSocket endpoint tested
- [ ] SSL certificate valid
- [ ] Health check endpoint responds
- [ ] Monitoring/alerts configured

---

**Generated with Claude Code 🤖**
