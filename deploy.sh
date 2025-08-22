#!/bin/bash

# 🚀 RoktoProbaho Production Deployment Script

echo "🩸 Starting RoktoProbaho Production Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Stop any running containers
echo "🛑 Stopping any running containers..."
docker-compose down

# Remove old images
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."

# Check backend
if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:5001"
else
    echo "❌ Backend is not responding"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend is not responding"
fi

# Check MongoDB
if docker-compose ps mongo | grep -q "Up"; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running"
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5001"
echo "   Health Check: http://localhost:5001/api/health"
echo ""
echo "🔧 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo ""
echo "🧪 Test credentials:"
echo "   Email: test@example.com"
echo "   Password: password123"
