# 🩸 RoktoProbaho - Real-Time Blood Donation Network

A comprehensive real-time blood donation networking system that connects donors with recipients instantly.

## ✨ Features

### 🔐 Authentication
- **User Registration & Login**: Secure JWT-based authentication
- **Profile Management**: Complete user profile with blood group, location, and preferences
- **Role-based Access**: Donor and recipient roles with different permissions

### 🩺 Blood Management
- **Blood Requests**: Create and manage urgent blood requests
- **Donor Matching**: Find compatible donors based on blood group and location
- **Request Tracking**: Real-time status updates for blood requests
- **Donation History**: Track donation records and statistics

### 📍 Location Services
- **Geolocation**: Optional PIN-based location tracking (Google Maps integration)
- **Nearby Donors**: Find donors in your vicinity (when coordinates are available)
- **Hospital Integration**: Connect with nearby hospitals and clinics
- **Flexible Location**: Users can provide address without requiring map coordinates

### 🔔 Real-time Features
- **Live Notifications**: Instant alerts for blood requests
- **Socket.IO Integration**: Real-time communication
- **Status Updates**: Live tracking of request status

### 📊 Analytics & Insights
- **Donor Statistics**: Comprehensive donor analytics
- **Leaderboard**: Top donors ranking system
- **Blood Group Distribution**: Visual representation of available blood groups
- **Donation Trends**: Historical data and trends

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Dark/Light Theme**: User preference support
- **Bengali/English**: Multi-language support
- **Accessibility**: WCAG compliant design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd rokto-probaho

# Install dependencies
npm install

# Start development servers
npm run dev          # Frontend (http://localhost:3000)
npm run dev:server   # Backend (http://localhost:5001)
```

### Test Credentials
- **Email**: `test@example.com`
- **Password**: `password123`

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js with App Router
- **UI Library**: React with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React Context API
- **Real-time**: Socket.IO Client

### Backend (Node.js/Express)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Real-time**: Socket.IO Server
- **Validation**: Zod schema validation

### Database (MongoDB)
- **User Management**: User profiles, authentication, preferences
- **Blood Requests**: Request tracking, status management
- **Donations**: Donation history, statistics
- **Notifications**: Real-time notification system

## 🐳 Docker Deployment

### Full Stack Deployment
```bash
# Build and start all services
npm run deploy:docker

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5001
# MongoDB: localhost:27017
```

### Individual Services
```bash
# Frontend only
docker build -t rokto-frontend .
docker run -p 3000:3000 rokto-frontend

# Backend only
docker build -f Dockerfile.backend -t rokto-backend .
docker run -p 5001:5001 rokto-backend
```

## ☁️ Cloud Deployment

### Vercel (Frontend)
1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
3. Deploy automatically

### Railway/Heroku (Backend)
1. Connect repository
2. Set environment variables:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secure secret key
   - `CORS_ORIGIN`: Frontend URL
3. Deploy

### MongoDB Atlas (Database)
1. Create free cluster
2. Get connection string
3. Update backend environment variables

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

#### Backend (.env)
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://localhost:27017/rokto-probaho
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Blood Requests
- `GET /api/requests` - Get all blood requests
- `POST /api/requests` - Create blood request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Cancel request

### Donors
- `GET /api/donors` - Get available donors
- `GET /api/donors/nearby` - Find nearby donors
- `GET /api/donors/stats` - Donor statistics
- `GET /api/donors/leaderboard` - Top donors

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user

## 🛠️ Development

### Available Scripts
```bash
npm run dev              # Start frontend development server
npm run dev:server       # Start backend development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript checks
npm run deploy:local     # Local production deployment
npm run deploy:docker    # Docker production deployment
```

### Project Structure
```
rokto-probaho/
├── src/                 # Frontend source code
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── lib/            # Utility functions
│   └── types/          # TypeScript type definitions
├── server/             # Backend source code
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   └── index.js        # Server entry point
├── public/             # Static assets
├── Dockerfile          # Frontend Docker configuration
├── Dockerfile.backend  # Backend Docker configuration
├── docker-compose.yml  # Full stack Docker configuration
└── package.json        # Project dependencies
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Zod schema validation
- **Rate Limiting**: API rate limiting (configurable)
- **HTTPS Support**: Production-ready SSL/TLS support

## 📊 Performance

- **Server-Side Rendering**: Next.js SSR for better SEO
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic code splitting
- **Caching**: HTTP caching headers
- **Database Indexing**: Optimized MongoDB queries
- **Real-time Optimization**: Efficient Socket.IO implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
1. Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
2. Review the troubleshooting section
3. Open an issue on GitHub
4. Contact the development team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for the database solution
- Socket.IO for real-time capabilities
- All contributors and supporters

---

**Made with ❤️ for saving lives through blood donation**
