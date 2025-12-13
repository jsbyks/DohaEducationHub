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
# Update Playwright config for production URL
cd frontend
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
