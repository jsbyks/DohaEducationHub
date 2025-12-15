# Week 8 - Deployment Guide
## Doha Education Hub MVP Launch

**Date**: December 13, 2025
**Goal**: Deploy MVP to production and enable beta testing

---

## 🚀 **Deployment Checklist**

### **Phase 1: Account Setup**
- [ ] Create Vercel account: https://vercel.com/signup
- [ ] Create Render account: https://render.com/register
- [ ] (Optional) Purchase domain name

### **Phase 2: Backend Deployment (Render)**

#### **Step 1: Prepare Backend for Production**
```bash
# 1. Create production environment file
cd backend
cp .env.example .env  # Create if doesn't exist

# 2. Update .env with production settings
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-production-secret-key
CORS_ORIGINS=https://your-frontend-domain.vercel.app

# Stripe (payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # set to enable webhook signature verification
# (Also set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in the frontend project for Stripe Elements)

# Test-only endpoints
# For CI and local E2E tests the backend exposes a small set of test-only endpoints used to create test data and simulate webhook events. These endpoints are disabled by default; enable them by setting `ENABLE_TEST_ENDPOINTS=1` in test/CI environments only. Do NOT enable this variable in production.

## Stripe Connect (Payouts)
If you plan to use Stripe Connect for teacher payouts, you will need to configure the following:

- **Backend** (Render/Railway): set `STRIPE_SECRET_KEY` and `STRIPE_CLIENT_ID`.
- **Frontend** (Vercel): set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Implement the Connect OAuth onboarding flow (redirect to Stripe using `STRIPE_CLIENT_ID`).

For CI and testing:

- Use the test-only endpoints (enable with `ENABLE_TEST_ENDPOINTS=1`) to simulate payouts and webhook events in Playwright runs.
- In GitHub Actions set `ENABLE_TEST_ENDPOINTS=1` in the workflow env and protect real Stripe secrets with repository secrets (`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`).

Preview deployment checklist (Render backend + Vercel frontend):

1. Push branch and open a PR (see `scripts/prepare_pr.sh`).
2. On Render, create a new Web Service pointing to this branch and set env vars:
   - `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS` (frontend domain), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
   - For test previews, set `ENABLE_TEST_ENDPOINTS=1` for running Playwright E2E only on preview.
3. On Vercel, set `NEXT_PUBLIC_API_URL` to the Render preview URL and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Run migrations on the Render instance (or include `./scripts/run_migrations.sh` in deploy step).
5. Verify site and run Playwright tests (PR workflow will run them automatically if set up).

Important: never enable `ENABLE_TEST_ENDPOINTS=1` in production; use it only for preview/testing.

# 3. Test production build locally
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

#### **Step 2: Deploy to Render**
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure build settings:
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard
6. Deploy!

### **Phase 3: Frontend Deployment (Vercel)**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
vercel login
```

#### **Step 2: Deploy Frontend**
```bash
cd frontend

# Deploy to Vercel
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set project name: doha-education-hub
# - Configure settings as prompted

# Set production environment variables
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-render-backend-url.onrender.com
```

#### **Step 3: Configure Custom Domain (Optional)**
```bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS (follow Vercel instructions)
# - Add CNAME record pointing to cname.vercel-dns.com
```

### **Phase 4: Database Setup**

#### **Option A: Render PostgreSQL**
1. In Render dashboard: "New +" → "PostgreSQL"
2. Create database with name: `doha_education_hub_prod`
3. Copy connection string to backend environment variables

#### **Option B: Railway PostgreSQL**
1. Go to https://railway.app/
2. Create new project
3. Add PostgreSQL database
4. Copy DATABASE_URL to environment variables

### **Phase 5: Environment Variables**

#### **Backend (Render/Railway)**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-256-bit-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

#### **Frontend (Vercel)**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

**How to set these variables**

- Vercel (Web UI): Project → Settings → Environment Variables → Add `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_BASE_URL` for `production`.
- Vercel (CLI):

```bash
# Interactively add a production env var
npx vercel env add NEXT_PUBLIC_API_URL production
# Or set via the dashboard for exact values
```

- Railway (CLI):

```bash
railway variables set NEXT_PUBLIC_API_URL https://your-backend-url.onrailway.app
railway variables set CORS_ORIGINS https://your-frontend-domain.vercel.app
```

- Render (Web UI): Service → Environment → Add `CORS_ORIGINS` with value `https://your-frontend-domain.vercel.app`
Note: The backend will print a warning if `CORS_ORIGINS` is not set in production; make sure to update it before going live.

Example values used in this project:

- `NEXT_PUBLIC_API_URL`: https://doha-education-hub-backend.up.railway.app
- `NEXT_PUBLIC_BASE_URL`: https://dohaeducationhub.vercel.app
- `CORS_ORIGINS`: https://dohaeducationhub.vercel.app
 - `CORS_ORIGINS`: https://doha-education-hub.vercel.app

Note: Make sure the value matches the exact deployed frontend origin (including hyphens).
If your Vercel project has a hyphenated name (e.g. `doha-education-hub`) include that exact hostname in `CORS_ORIGINS`.

### **Phase 6: DNS & SSL Setup**

#### **Vercel Automatic SSL**
- Vercel provides automatic SSL certificates
- No additional configuration needed

#### **Custom Domain Setup**
1. Add domain in Vercel dashboard
2. Configure DNS records as instructed
3. Wait for SSL certificate provisioning (usually 24-48 hours)

---

## 🔧 **Troubleshooting Common Issues**

### **Backend Deployment Issues**
```bash
# Check Render logs
# Common issues:
# 1. Missing environment variables
# 2. Database connection issues
# 3. Port binding problems (use $PORT variable)
```

### **Frontend Deployment Issues**
```bash
# Check Vercel build logs
# Common issues:
# 1. NEXT_PUBLIC_API_URL not set
# 2. Build errors due to missing dependencies
# 3. Environment variable case sensitivity
```

### **CORS Issues**
```bash
# Update backend CORS_ORIGINS to include Vercel domain:
CORS_ORIGINS=https://your-project.vercel.app,https://your-custom-domain.com
```

---

## 🧪 **Testing Production Deployment**

### **Manual Testing Checklist**
- [ ] Homepage loads correctly
- [ ] School search functionality works
- [ ] School detail pages load
- [ ] User registration works
- [ ] User login works
- [ ] Admin dashboard accessible
- [ ] API endpoints respond correctly
- [ ] No console errors in browser

### **Automated Testing**
```bash
# Backend tests (Python)
cd backend
# Activate your virtualenv then:
pytest

# Frontend Playwright tests (Node)
cd frontend

# Run Playwright tests locally against a running frontend/backend preview
# Ensure backend is running with ENABLE_TEST_ENDPOINTS=1 so the tests can simulate webhooks
export PLAYWRIGHT_BASE_URL=http://localhost:3000
export PLAYWRIGHT_API_BASE=http://localhost:8000/api
npx playwright test

npx playwright test --config=playwright.config.ts
```

---

## 📊 **Post-Deployment Monitoring**

### **Essential Monitoring**
1. **Uptime Monitoring**: Set up UptimeRobot or similar
2. **Error Tracking**: Add Sentry or LogRocket
3. **Analytics**: Set up Google Analytics/Mixpanel
4. **Performance**: Monitor Core Web Vitals

### **Key Metrics to Track**
- Page load times
- Error rates
- User signups
- School searches
- Page views per session

---

## 🚨 **Rollback Plan**

### **If Deployment Fails**
```bash
# Frontend rollback (Vercel)
vercel rollback

# Backend rollback (Render)
# Use Render's deployment history to rollback to previous version
```

### **Emergency Contacts**
- Vercel Support: https://vercel.com/support
- Render Support: https://render.com/docs/support
- Railway Support: https://docs.railway.app/

---

## 🎯 **Beta Launch Checklist**

### **Pre-Launch (Today)**
- [ ] Deploy backend to production
- [ ] Deploy frontend to production
- [ ] Test all core functionality
- [ ] Set up monitoring and error tracking
- [ ] Prepare beta user invitation list

### **Launch Day**
- [ ] Send beta invitations (20-50 users)
- [ ] Monitor initial signups and usage
- [ ] Respond to bug reports within 24 hours
- [ ] Collect feedback through surveys

### **Week 8 Goals**
- [ ] MVP accessible online ✅
- [ ] 20+ beta users invited ✅
- [ ] Core user flows working ✅
- [ ] 10+ pieces of actionable feedback ✅
- [ ] Sprint retrospective completed ✅

---

## 💡 **Quick Commands Reference**

```bash
# Backend local testing
cd backend && python -m uvicorn main:app --reload

# Frontend local testing
cd frontend && npm run dev

# Vercel deployment
cd frontend && vercel

# Environment setup
cp .env.example .env.local  # Frontend
cp .env.example .env        # Backend
```

---

## 📞 **Support Resources**

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://docs.render.com/
- **Railway Docs**: https://docs.railway.app/
- **Next.js Deployment**: https://nextjs.org/docs/deployment

**Need help?** Check deployment logs first, then refer to service-specific documentation.

