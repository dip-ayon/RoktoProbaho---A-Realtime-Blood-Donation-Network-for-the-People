# 🚀 RoktoProbaho Deployment Guide

## 📋 Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- MongoDB (for production)
- Git

## 🏠 Local Development

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd rokto-probaho

# Install dependencies
npm install

# Start development servers
npm run dev        
npm run dev:server  
```

### Test Credentials
- **Email**: `test@example.com`
- **Password**: `password123`

### Optional Features
- **Google Maps API**: Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for map functionality
- **Location Services**: Map pinning is optional - users can provide addresses without coordinates

## 🐳 Docker Deployment

### Option 1: Full Stack with Docker Compose
```bash
npm run deploy:docker

# Or manually:
docker-compose up -d

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Option 2: Individual Services
```bash
# Build frontend
docker build -t rokto-frontend .

# Build backend
docker build -f Dockerfile.backend -t rokto-backend .

# Run with MongoDB
docker run -d --name mongo mongo:6.0
docker run -d --name backend --link mongo rokto-backend
docker run -d --name frontend --link backend rokto-frontend
```

## ☁️ Cloud Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
3. Deploy automatically on push

### Railway/Heroku (Backend)
1. Connect your repository
2. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your secret key
   - `CORS_ORIGIN`: Your frontend URL
3. Deploy

### MongoDB Atlas (Database)
1. Create a free cluster
2. Get connection string
3. Update backend environment variables

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Backend (.env)
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://localhost:27017/rokto-probaho
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

## 📊 Production Checklist

- [ ] Set secure JWT_SECRET
- [ ] Configure MongoDB connection
- [ ] Set up CORS origins
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Test all features
- [ ] Set up CI/CD pipeline

## 🛠️ Troubleshooting

### Port Conflicts
```bash
# Check what's using the port
netstat -ano | findstr :5001
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
netstat -ano | findstr :27017

# Start MongoDB (if installed)
mongod --dbpath C:\data\db
```

### Docker Issues
```bash
# Clean up Docker
docker system prune -a
docker volume prune

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔒 Security Considerations

1. **JWT Secret**: Use a strong, random secret
2. **CORS**: Restrict origins to your domains
3. **MongoDB**: Use authentication and network security
4. **HTTPS**: Always use in production
5. **Rate Limiting**: Implement API rate limiting
6. **Input Validation**: Validate all user inputs

## 📈 Monitoring

### Health Checks
- Frontend: `http://your-domain.com`
- Backend: `http://your-domain.com/api/health`

### Logs
```bash
# Docker logs
docker-compose logs -f

# Application logs
npm run docker:logs
```

## 🚀 Quick Deploy Commands

```bash
# Local production
npm run deploy:local

# Docker production
npm run deploy:docker

# Development
npm run dev
npm run dev:server
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs for error messages
3. Test with the provided test credentials
4. Verify all environment variables are set correctly
