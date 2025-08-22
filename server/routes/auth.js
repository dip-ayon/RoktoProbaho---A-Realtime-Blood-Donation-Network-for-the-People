const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const userData = {
      name,
      email,
      phone,
      password,
      bloodGroup,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address
    };

    // Only add location if provided
    if (location && location.coordinates && location.coordinates.length === 2) {
      userData.location = location;
    }

    const user = new User(userData);

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.getPublicProfile() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile', details: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'name', 'phone', 'bloodGroup', 'address', 'location', 
      'emergencyContact', 'medicalHistory', 'profilePicture'
    ];

    const filteredUpdates = {};
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password', details: error.message });
  }
});

// Toggle donor status
router.put('/toggle-donor', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isDonor = !user.isDonor;
    if (user.isDonor) {
      user.isAvailable = true; // Make available when becoming a donor
    } else {
      user.isAvailable = false; // Make unavailable when stopping being a donor
    }

    await user.save();

    res.json({
      message: `Successfully ${user.isDonor ? 'registered as' : 'unregistered from'} donor`,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Toggle donor error:', error);
    res.status(500).json({ error: 'Failed to toggle donor status', details: error.message });
  }
});

// Toggle availability status
router.put('/toggle-availability', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isDonor) {
      return res.status(400).json({ error: 'You must be a donor to toggle availability' });
    }

    user.isAvailable = !user.isAvailable;
    await user.save();

    res.json({
      message: `Successfully ${user.isAvailable ? 'made available' : 'made unavailable'} for donations`,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ error: 'Failed to toggle availability', details: error.message });
  }
});

// Logout (client-side token removal)
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
