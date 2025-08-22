const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all available donors
router.get('/', async (req, res) => {
  try {
    const {
      bloodGroup,
      city,
      state,
      page = 1,
      limit = 20,
      sortBy = 'totalDonations',
      sortOrder = 'desc'
    } = req.query;

    const filter = {
      isDonor: true,
      isAvailable: true
    };

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    if (state) filter['address.state'] = { $regex: state, $options: 'i' };

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const donors = await User.find(filter)
      .select('name bloodGroup address location totalDonations lastDonationDate isAvailable')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      donors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get donors error:', error);
    res.status(500).json({ error: 'Failed to get donors', details: error.message });
  }
});

// Get nearby donors
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 50000, bloodGroup } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required for nearby search' });
    }

    const filter = {
      isDonor: true,
      isAvailable: true,
      'location.coordinates': { $exists: true, $ne: null }
    };

    // Add location-based filtering only if coordinates are provided
    if (latitude && longitude) {
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      };
    }

    if (bloodGroup) filter.bloodGroup = bloodGroup;

    const donors = await User.find(filter)
      .select('name bloodGroup address location totalDonations lastDonationDate')
      .sort({ totalDonations: -1 })
      .limit(50);

    res.json({ donors });

  } catch (error) {
    console.error('Get nearby donors error:', error);
    res.status(500).json({ error: 'Failed to get nearby donors', details: error.message });
  }
});

// Get donor statistics
router.get('/stats', async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ isDonor: true });
    const availableDonors = await User.countDocuments({ isDonor: true, isAvailable: true });
    
    const bloodGroupStats = await User.aggregate([
      { $match: { isDonor: true, isAvailable: true } },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topDonors = await User.find({ isDonor: true })
      .select('name bloodGroup totalDonations lastDonationDate')
      .sort({ totalDonations: -1 })
      .limit(10);

    const recentDonors = await User.find({ 
      isDonor: true, 
      lastDonationDate: { $exists: true, $ne: null } 
    })
      .select('name bloodGroup lastDonationDate')
      .sort({ lastDonationDate: -1 })
      .limit(10);

    res.json({
      totalDonors,
      availableDonors,
      bloodGroupStats,
      topDonors,
      recentDonors
    });

  } catch (error) {
    console.error('Get donor stats error:', error);
    res.status(500).json({ error: 'Failed to get donor statistics', details: error.message });
  }
});

// Get donor leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { period = 'all', limit = 20 } = req.query;

    let dateFilter = {};
    if (period === 'month') {
      dateFilter = { lastDonationDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'year') {
      dateFilter = { lastDonationDate: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
    }

    const leaderboard = await User.find({
      isDonor: true,
      ...dateFilter
    })
      .select('name bloodGroup totalDonations lastDonationDate')
      .sort({ totalDonations: -1, lastDonationDate: -1 })
      .limit(parseInt(limit));

    res.json({ leaderboard });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard', details: error.message });
  }
});

// Get specific donor profile (public info only)
router.get('/:id', auth, async (req, res) => {
  try {
    const donor = await User.findById(req.params.id)
      .select('name bloodGroup address location totalDonations lastDonationDate isAvailable isDonor');

    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    if (!donor.isDonor) {
      return res.status(400).json({ error: 'This user is not a donor' });
    }

    res.json({ donor });

  } catch (error) {
    console.error('Get donor profile error:', error);
    res.status(500).json({ error: 'Failed to get donor profile', details: error.message });
  }
});

// Search donors
router.get('/search', auth, async (req, res) => {
  try {
    const { q, bloodGroup, city, state, page = 1, limit = 20 } = req.query;

    const filter = {
      isDonor: true,
      isAvailable: true
    };

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    if (state) filter['address.state'] = { $regex: state, $options: 'i' };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { 'address.city': { $regex: q, $options: 'i' } },
        { 'address.state': { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const donors = await User.find(filter)
      .select('name bloodGroup address location totalDonations lastDonationDate')
      .sort({ totalDonations: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      donors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Search donors error:', error);
    res.status(500).json({ error: 'Failed to search donors', details: error.message });
  }
});

module.exports = router;
