# 🚀 Vercel Deployment Guide for RoktoProbaho

## 📋 Quick Setup Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Railway/Heroku
- [ ] Vercel project connected to GitHub
- [ ] Environment variables configured
- [ ] Domain configured (optional)

## 🔄 Step-by-Step Deployment

### 1. **Prepare Your Repository**
```bash
# Commit any changes
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. **Deploy Backend First**

#### Option A: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd server
railway login
railway init
railway up

# Note the deployed URL (e.g., https://your-app.railway.app)
```

#### Option B: Heroku
```bash
# Install Heroku CLI, then:
heroku create your-rokto-api
git subtree push --prefix server heroku main

# Note the deployed URL (e.g., https://your-rokto-api.herokuapp.com)
```

### 3. **Set Up MongoDB Atlas**
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Create database user (Database Access)
4. Whitelist IP addresses (Network Access) - Add `0.0.0.0/0` for all IPs
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/rokto-probaho`

### 4. **Configure Backend Environment Variables**
On your backend platform (Railway/Heroku), set:
```bash
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rokto-probaho
JWT_SECRET=your-super-secure-random-string-here
CORS_ORIGIN=https://your-vercel-app.vercel.app
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 5. **Deploy Frontend to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure settings:
   - Framework Preset: **Next.js**
   - Root Directory: **./** (root)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 6. **Configure Vercel Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
# Replace with your actual backend URL
```

Optional (for Google Maps):
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 7. **Test Your Deployment**
- Frontend: `https://your-project.vercel.app`
- Backend Health: `https://your-backend-url/api/health`
- Test login with: `test@example.com` / `password123`

## 🔧 Environment Variables Summary

### Frontend (.env.local - for local development)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
```

### Backend (.env - for local development)
```bash
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/rokto-probaho
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### Production Environment Variables
**Vercel (Frontend):**
- `NEXT_PUBLIC_API_URL`: Your backend URL
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: (optional)

**Backend Platform:**
- `NODE_ENV`: production
- `PORT`: 5001 (or assigned by platform)
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong random string
- `CORS_ORIGIN`: Your Vercel app URL
- `FRONTEND_URL`: Your Vercel app URL

## 🐛 Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure `CORS_ORIGIN` matches your Vercel URL exactly
2. **API Not Found**: Check `NEXT_PUBLIC_API_URL` is correct
3. **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
4. **Build Errors**: Check TypeScript errors in Vercel build logs

### Debug Commands:
```bash
# Check local build
npm run build
npm start

# Test API locally
npm run server

# View Vercel logs
vercel logs
```

## 🚀 Quick Deploy Script
Create a file `deploy.js`:
```javascript
// deploy.js - Run: node deploy.js
const { execSync } = require('child_process');

console.log('🚀 Deploying RoktoProbaho...');

try {
  // Build and test locally first
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Local build successful');
  
  // Push to GitHub (triggers Vercel deployment)
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy to production"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Pushed to GitHub - Vercel will auto-deploy');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
}
```

## 📞 Support URLs
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **MongoDB Atlas**: [cloud.mongodb.com](https://cloud.mongodb.com)
- **Railway Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Heroku Dashboard**: [dashboard.heroku.com](https://dashboard.heroku.com)