# Rokto Probaho Backend

This is the backend API for the Rokto Probaho blood donation network.

## Features

- **User Authentication**: Registration, login, JWT-based authentication
- **Blood Donation Management**: Create, accept, and manage blood donation requests
- **Donor Management**: Find nearby donors, manage donor availability
- **Real-time Communication**: Socket.IO for real-time notifications
- **Geolocation Services**: Find donors and requests by location
- **Admin Panel**: User management and statistics

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `PUT /api/auth/toggle-donor` - Toggle donor status
- `PUT /api/auth/toggle-availability` - Toggle availability

### Blood Requests
- `POST /api/requests` - Create blood request
- `GET /api/requests` - Get all requests (with filters)
- `GET /api/requests/nearby` - Get nearby requests
- `GET /api/requests/:id` - Get specific request
- `POST /api/requests/:id/accept` - Accept request
- `POST /api/requests/:id/complete` - Complete donation
- `PUT /api/requests/:id` - Update request
- `POST /api/requests/:id/cancel` - Cancel request
- `GET /api/requests/user/me` - Get user's requests
- `GET /api/requests/user/accepted` - Get accepted requests

### Donors
- `GET /api/donors` - Get all available donors
- `GET /api/donors/nearby` - Get nearby donors
- `GET /api/donors/stats` - Get donor statistics
- `GET /api/donors/leaderboard` - Get donor leaderboard
- `GET /api/donors/:id` - Get donor profile
- `GET /api/donors/search` - Search donors

### Users (Admin)
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/search` - Search users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/verify` - Verify user
- `GET /api/users/:id/activity` - Get user activity

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create environment file**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/rokto-probaho
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start MongoDB**:
   - Local: Start MongoDB service
   - Atlas: Use your MongoDB Atlas connection string

4. **Run the server**:
   ```bash
   # Development
   npm run dev:server
   
   # Production
   npm run server
   ```

### Database Setup

The application will automatically create the necessary collections and indexes when it starts.

### Socket.IO Events

- `join-user` - Join user to their room
- `blood-request` - Broadcast new blood request
- `donor-available` - Broadcast donor availability update
- `send-message` - Send chat message
- `new-blood-request` - Receive new blood request
- `donor-status-update` - Receive donor status update
- `new-message` - Receive new message

## Development

### Project Structure
```
server/
├── index.js              # Main server file
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   ├── User.js           # User model
│   └── BloodRequest.js   # Blood request model
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── donors.js         # Donor routes
│   ├── requests.js       # Blood request routes
│   └── users.js          # User management routes
└── README.md             # This file
```

### Testing the API

You can test the API using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "bloodGroup": "O+",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }'
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Use MongoDB Atlas or a production MongoDB instance
4. Set up proper CORS configuration
5. Use environment variables for all sensitive data
6. Set up SSL/TLS certificates
7. Configure proper logging and monitoring

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)
- HTTPS in production
