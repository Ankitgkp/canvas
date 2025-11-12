# 🚀 Complete Deployment Guide

## ✅ EASIEST: Deploy to Render.com

### Prerequisites
- GitHub account with your code pushed
- Render.com account (free tier available)
- Your Neon PostgreSQL database URL

### Steps:

#### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Sign Up on Render
- Go to https://render.com
- Sign up with your GitHub account

#### 3. Create a New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Ankitgkp/canvas`
3. If prompted, give Render access to your repositories

#### 4. Configure Your Web Service

**Name:** `canvas-app` (or any name you prefer)

**Region:** Choose closest to you (e.g., Oregon, Frankfurt, Singapore)

**Branch:** `main`

**Root Directory:** (leave empty)

**Runtime:** `Node`

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Instance Type:** `Free`

#### 5. Add Environment Variables

Click **"Advanced"** and add these environment variables:

```
DATABASE_URL
Value: postgresql://neondb_owner:npg_lI40GqEChrUH@ep-delicate-dream-adi0uvd5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET
Value: B5h0sd4kyx@

NODE_ENV
Value: production
```

**Note:** Port is automatically set by Render, don't add it.

#### 6. Deploy!
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://canvas-app.onrender.com`

---

## 🔄 Alternative: Deploy to Railway.app

### Steps:

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Login and Deploy
```bash
railway login
railway init
railway up
```

#### 3. Add Environment Variables
```bash
railway variables set DATABASE_URL="postgresql://neondb_owner:npg_lI40GqEChrUH@ep-delicate-dream-adi0uvd5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

railway variables set JWT_SECRET="B5h0sd4kyx@"

railway variables set NODE_ENV="production"
```

#### 4. Generate Domain
```bash
railway domain
```

You'll get a URL like: `https://canvas-app.up.railway.app`

---

## ⚡ Alternative: Deploy to Vercel (Frontend) + Render (Backend)

Since Vercel is primarily for frontend/serverless, here's a split deployment:

### Backend on Render (as described above)

### Frontend on Vercel:

#### 1. Update vite.config.ts
Change the API proxy to point to your Render backend URL:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://your-render-app.onrender.com',
        changeOrigin: true
      }
    }
  }
})
```

#### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📝 Post-Deployment Checklist

After deployment, test these endpoints:

1. **Health Check**
   ```
   https://your-app-url.onrender.com/api/health
   ```
   Should return: `{"status":"ok",...}`

2. **Frontend**
   ```
   https://your-app-url.onrender.com
   ```
   Should show your login/register page

3. **Test Registration**
   - Create a new account
   - Verify you can login

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `dependencies` not `devDependencies`

### Database Connection Error
- Verify DATABASE_URL is correct
- Check Neon database is running
- Ensure database allows connections from Render IPs

### CORS Error
- The app is configured to accept requests from Render domains
- If using custom domain, add it to CORS_ORIGINS environment variable

### App Crashes
- Check logs in Render dashboard
- Verify all environment variables are set
- Check PORT is not hardcoded (Render assigns it automatically)

---

## 🎯 Recommended Approach

**Use Render.com** - It's the simplest and most reliable for full-stack Node.js apps like yours.

Free tier includes:
- ✅ 750 hours/month
- ✅ Automatic HTTPS
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variable management
- ⚠️ Spins down after 15 min inactivity (50s cold start)

---

## 🔐 Security Note

After deployment, generate a stronger JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update the JWT_SECRET in your Render environment variables.
