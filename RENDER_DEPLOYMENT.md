# Render Deployment Instructions

## Prerequisites
- Render account (https://render.com)
- GitHub repository connected to your project
- PostgreSQL database (you already have Neon)

## Deployment Steps

### 1. Push your code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create a New Web Service on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (canvas)
4. Configure the service:

**Service Name:** `canvas` (or your preferred name)

**Region:** Choose closest to you (e.g., Oregon, Ohio, Frankfurt)

**Branch:** `main`

**Root Directory:** Leave empty

**Runtime:** `Node`

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

### 3. Add Environment Variables

In the "Environment" section, add these variables:

```
DATABASE_URL = postgresql://neondb_owner:npg_lI40GqEChrUH@ep-delicate-dream-adi0uvd5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET = B5h0sd4kyx@

NODE_ENV = production

PORT = 10000
```

**Important:** Render uses port 10000 by default for web services.

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Install dependencies
   - Build your frontend
   - Generate Prisma Client
   - Start your server

### 5. Verify Deployment

Once deployed, your app will be available at:
```
https://your-service-name.onrender.com
```

Test these endpoints:
- `https://your-service-name.onrender.com/api/health` - Should return OK
- `https://your-service-name.onrender.com` - Should show your app

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Ensure all environment variables are set correctly

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check that your Neon database allows connections from Render's IP ranges

### App Not Loading
- Check the start command logs
- Ensure PORT environment variable is set correctly (10000 for Render)

## Free Tier Notes

Render's free tier:
- Spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month of free runtime

## Custom Domain (Optional)

1. Go to Settings → Custom Domain
2. Add your domain
3. Configure DNS records as instructed by Render
