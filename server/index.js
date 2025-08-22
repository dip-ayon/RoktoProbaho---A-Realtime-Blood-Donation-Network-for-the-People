const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donors');
const requestRoutes = require('./routes/requests');
const userRoutes = require('./routes/users');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for testing
const inMemoryDB = {
  users: [],
  bloodRequests: [],
  nextUserId: 1,
  nextRequestId: 1
};

// Mock data for testing
const mockUsers = [
  {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+8801712345678',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    bloodGroup: 'O+',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'other',
    address: {
      street: '123 Test Street',
      city: 'Dhaka',
      state: 'Dhaka',
      country: 'Bangladesh'
    },
    isDonor: true,
    isAvailable: true,
    totalDonations: 3,
    lastDonationDate: new Date('2024-01-15'),
    isVerified: true,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Ahmed Khan',
    email: 'ahmed.khan@example.com',
    phone: '+8801712345671',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    bloodGroup: 'O+',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'male',
    address: {
      street: '456 Mirpur Road',
      city: 'Dhaka',
      state: 'Dhaka',
      country: 'Bangladesh'
    },
    isDonor: true,
    isAvailable: true,
    totalDonations: 8,
    lastDonationDate: new Date('2024-01-10'),
    isVerified: true,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockBloodRequests = [
  {
    _id: '1',
    requester: '1',
    patientName: 'Karim Ahmed',
    bloodGroup: 'O+',
    units: 2,
    urgency: 'high',
    hospital: {
      name: 'Dhaka Medical College Hospital',
      address: { street: 'Dhaka Medical College', city: 'Dhaka', state: 'Dhaka' },
      phone: '+880-2-9660017',
    },
    requiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    description: 'Patient needs blood for surgery',
    contactPerson: {
      name: 'Ahmed Khan',
      phone: '+8801712345671',
      relationship: 'Brother',
    },
    status: 'pending',
    acceptedBy: [],
    isUrgent: true,
    tags: ['surgery', 'urgent'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Initialize in-memory data
inMemoryDB.users = [...mockUsers];
inMemoryDB.bloodRequests = [...mockBloodRequests];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Rokto Probaho API is running',
    timestamp: new Date().toISOString(),
    database: 'in-memory'
  });
});

// Mock donor routes
app.get('/api/donors', (req, res) => {
  try {
    const donors = inMemoryDB.users.filter(user => user.isDonor && user.isAvailable);
    res.json({
      donors: donors.map(donor => ({
        _id: donor._id,
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        address: donor.address,
        totalDonations: donor.totalDonations,
        lastDonationDate: donor.lastDonationDate,
        isAvailable: donor.isAvailable
      })),
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: donors.length,
        itemsPerPage: donors.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get donors', details: error.message });
  }
});

app.get('/api/donors/stats', (req, res) => {
  try {
    const totalDonors = inMemoryDB.users.filter(user => user.isDonor).length;
    const availableDonors = inMemoryDB.users.filter(user => user.isDonor && user.isAvailable).length;
    
    const bloodGroupStats = inMemoryDB.users
      .filter(user => user.isDonor)
      .reduce((acc, user) => {
        acc[user.bloodGroup] = (acc[user.bloodGroup] || 0) + 1;
        return acc;
      }, {});

    const topDonors = inMemoryDB.users
      .filter(user => user.isDonor)
      .sort((a, b) => b.totalDonations - a.totalDonations)
      .slice(0, 5);

    res.json({
      totalDonors,
      availableDonors,
      bloodGroupStats: Object.entries(bloodGroupStats).map(([group, count]) => ({ _id: group, count })),
      topDonors,
      recentDonors: topDonors.slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get donor stats', details: error.message });
  }
});

app.get('/api/donors/leaderboard', (req, res) => {
  try {
    const leaderboard = inMemoryDB.users
      .filter(user => user.isDonor)
      .sort((a, b) => b.totalDonations - a.totalDonations)
      .slice(0, 20);

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get leaderboard', details: error.message });
  }
});

// Mock blood requests routes
app.get('/api/requests', (req, res) => {
  try {
    const requests = inMemoryDB.bloodRequests.map(request => ({
      ...request,
      requester: inMemoryDB.users.find(user => user._id === request.requester)
    }));

    res.json({
      requests,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: requests.length,
        itemsPerPage: requests.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blood requests', details: error.message });
  }
});

// Mock auth routes
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = inMemoryDB.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Simple password check for testing (in real app, use bcrypt)
    if (password !== 'password123') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = 'mock-jwt-token-' + Date.now();
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        isDonor: user.isDonor,
        isAvailable: user.isAvailable,
        totalDonations: user.totalDonations,
        lastDonationDate: user.lastDonationDate,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      bloodGroup,
      dateOfBirth,
      gender,
      address,
      location
    } = req.body;

    // Check if user already exists
    const existingUser = inMemoryDB.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const newUser = {
      _id: inMemoryDB.nextUserId.toString(),
      name,
      email,
      phone,
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
      bloodGroup,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      location,
      isDonor: false,
      isAvailable: false,
      totalDonations: 0,
      isVerified: false,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    inMemoryDB.users.push(newUser);
    inMemoryDB.nextUserId++;

    const token = 'mock-jwt-token-' + Date.now();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        bloodGroup: newUser.bloodGroup,
        dateOfBirth: newUser.dateOfBirth,
        gender: newUser.gender,
        address: newUser.address,
        isDonor: newUser.isDonor,
        isAvailable: newUser.isAvailable,
        totalDonations: newUser.totalDonations,
        isVerified: newUser.isVerified,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });

  // Handle blood request notifications
  socket.on('blood-request-created', (data) => {
    socket.broadcast.emit('new-blood-request', data);
  });

  // Handle donation notifications
  socket.on('donation-completed', (data) => {
    socket.broadcast.emit('donation-update', data);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log('Server on port', PORT));

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Using in-memory database for testing`);
  console.log(`📊 Sample data loaded: ${inMemoryDB.users.length} users, ${inMemoryDB.bloodRequests.length} requests`);
});
const cors = require("cors");
const allowed = (process.env.CORS_ORIGIN || "").split(",");
app.use(cors({ origin: allowed.length ? allowed : true, credentials: true }));

