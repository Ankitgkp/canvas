# Environment Variables for Deployment

## Required Environment Variables

### DATABASE_URL
Your PostgreSQL database connection string from Neon
Example: `postgresql://username:password@host:port/database?sslmode=require`

### JWT_SECRET
A secure secret key for JWT token signing
Example: `your-super-secure-secret-key-here`

### Optional Environment Variables

### PORT
Port number for the server (default: 3001)

### NODE_ENV
Environment mode (production/development)

## Deployment Steps

### 1. Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Set up environment variables in Vercel:
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

### 2. Railway Deployment

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   railway login
   railway init
   railway add
   ```

### 3. Render Deployment

1. Connect your GitHub repository to Render
2. Set up environment variables in Render dashboard
3. Deploy as a Web Service

## Database Setup

Make sure your PostgreSQL database (Neon) is accessible from your deployment platform.
Your current Neon database should work with any deployment platform.
