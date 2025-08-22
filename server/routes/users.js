const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ isDonor: true });
    const availableDonors = await User.countDocuments({ isDonor: true, isAvailable: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    const bloodGroupDistribution = await User.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const genderDistribution = await User.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentRegistrations = await User.find()
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalDonors,
      availableDonors,
      verifiedUsers,
      bloodGroupDistribution,
      genderDistribution,
      recentRegistrations
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user statistics', details: error.message });
  }
});

// Search users (admin only)
router.get('/search', auth, async (req, res) => {
  try {
    const { q, bloodGroup, city, state, isDonor, page = 1, limit = 20 } = req.query;

    // Check if user is admin
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const filter = {};

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    if (state) filter['address.state'] = { $regex: state, $options: 'i' };
    if (isDonor !== undefined) filter.isDonor = isDonor === 'true';

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('name email phone bloodGroup address isDonor isAvailable totalDonations createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users', details: error.message });
  }
});

// Get user by ID (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin or requesting their own profile
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If admin, return full profile, otherwise return public profile
    const userData = currentUser.role === 'admin' ? user : user.getPublicProfile();

    res.json({ user: userData });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user', details: error.message });
  }
});

// Update user (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const updates = req.body;
    const allowedUpdates = [
      'name', 'email', 'phone', 'bloodGroup', 'address', 'location',
      'isDonor', 'isAvailable', 'isVerified', 'role', 'medicalHistory'
    ];

    const filteredUpdates = {};
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// Verify user (admin only)
router.post('/:id/verify', auth, async (req, res) => {
  try {
    // Check if user is admin
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User verified successfully',
      user
    });

  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Failed to verify user', details: error.message });
  }
});

// Get user activity
router.get('/:id/activity', auth, async (req, res) => {
  try {
    // Check if user is requesting their own activity or is admin
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // This would typically include donation history, requests made, etc.
    // For now, we'll return basic user activity data
    const activity = {
      totalDonations: user.totalDonations,
      lastDonationDate: user.lastDonationDate,
      isDonor: user.isDonor,
      isAvailable: user.isAvailable,
      memberSince: user.createdAt,
      lastActive: user.updatedAt
    };

    res.json({ activity });

  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ error: 'Failed to get user activity', details: error.message });
  }
});

module.exports = router;
