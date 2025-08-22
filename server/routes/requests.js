const express = require('express');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new blood request
router.post('/', auth, async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      units,
      urgency,
      hospital,
      location,
      requiredDate,
      description,
      contactPerson,
      tags
    } = req.body;

    const bloodRequest = new BloodRequest({
      requester: req.user.userId,
      patientName,
      bloodGroup,
      units,
      urgency,
      hospital,
      location,
      requiredDate,
      description,
      contactPerson,
      tags,
      isUrgent: urgency === 'emergency' || urgency === 'high'
    });

    await bloodRequest.save();

    // Populate requester details
    await bloodRequest.populate('requester', 'name phone');

    res.status(201).json({
      message: 'Blood request created successfully',
      request: bloodRequest
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create blood request', details: error.message });
  }
});

// Get all blood requests (with filters)
router.get('/', async (req, res) => {
  try {
    const {
      status,
      bloodGroup,
      urgency,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (urgency) filter.urgency = urgency;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const requests = await BloodRequest.find(filter)
      .populate('requester', 'name phone')
      .populate('acceptedBy.donor', 'name phone bloodGroup')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BloodRequest.countDocuments(filter);

    res.json({
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to get blood requests', details: error.message });
  }
});

// Get nearby blood requests
router.get('/nearby', auth, async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 50000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];

    const requests = await BloodRequest.findNearby(coordinates, parseInt(maxDistance));

    res.json({ requests });

  } catch (error) {
    console.error('Get nearby requests error:', error);
    res.status(500).json({ error: 'Failed to get nearby requests', details: error.message });
  }
});

// Get single blood request
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requester', 'name phone email')
      .populate('acceptedBy.donor', 'name phone bloodGroup email');

    if (!request) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    res.json({ request });

  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: 'Failed to get blood request', details: error.message });
  }
});

// Accept blood request
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    // Check if user is a donor and available
    const user = await User.findById(req.user.userId);
    if (!user.isDonor || !user.isAvailable) {
      return res.status(400).json({ error: 'You must be an available donor to accept requests' });
    }

    // Check if user can accept this request
    if (!request.canAccept(req.user.userId)) {
      return res.status(400).json({ error: 'Cannot accept this request' });
    }

    await request.acceptRequest(req.user.userId);

    // Populate the updated request
    await request.populate('requester', 'name phone');
    await request.populate('acceptedBy.donor', 'name phone bloodGroup');

    res.json({
      message: 'Request accepted successfully',
      request
    });

  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'Failed to accept request', details: error.message });
  }
});

// Complete donation
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    await request.completeDonation(req.user.userId);

    // Update user's donation count and last donation date
    const user = await User.findById(req.user.userId);
    user.totalDonations += 1;
    user.lastDonationDate = new Date();
    await user.save();

    // Populate the updated request
    await request.populate('requester', 'name phone');
    await request.populate('acceptedBy.donor', 'name phone bloodGroup');

    res.json({
      message: 'Donation completed successfully',
      request
    });

  } catch (error) {
    console.error('Complete donation error:', error);
    res.status(500).json({ error: 'Failed to complete donation', details: error.message });
  }
});

// Update blood request
router.put('/:id', auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    // Only requester can update the request
    if (request.requester.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You can only update your own requests' });
    }

    // Only allow updates if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot update request that is not pending' });
    }

    const allowedUpdates = [
      'patientName', 'bloodGroup', 'units', 'urgency', 'hospital',
      'location', 'requiredDate', 'description', 'contactPerson', 'tags'
    ];

    const updates = req.body;
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        request[field] = updates[field];
      }
    });

    request.isUrgent = request.urgency === 'emergency' || request.urgency === 'high';
    await request.save();

    // Populate the updated request
    await request.populate('requester', 'name phone');
    await request.populate('acceptedBy.donor', 'name phone bloodGroup');

    res.json({
      message: 'Request updated successfully',
      request
    });

  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update request', details: error.message });
  }
});

// Cancel blood request
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await BloodRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    // Only requester can cancel the request
    if (request.requester.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You can only cancel your own requests' });
    }

    // Only allow cancellation if request is pending or in-progress
    if (!['pending', 'in-progress'].includes(request.status)) {
      return res.status(400).json({ error: 'Cannot cancel this request' });
    }

    request.status = 'cancelled';
    request.cancelledAt = new Date();
    request.cancelledBy = req.user.userId;
    request.cancellationReason = reason;

    await request.save();

    res.json({
      message: 'Request cancelled successfully',
      request
    });

  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ error: 'Failed to cancel request', details: error.message });
  }
});

// Get user's blood requests
router.get('/user/me', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { requester: req.user.userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const requests = await BloodRequest.find(filter)
      .populate('requester', 'name phone')
      .populate('acceptedBy.donor', 'name phone bloodGroup')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BloodRequest.countDocuments(filter);

    res.json({
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ error: 'Failed to get user requests', details: error.message });
  }
});

// Get requests accepted by user
router.get('/user/accepted', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { 'acceptedBy.donor': req.user.userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const requests = await BloodRequest.find(filter)
      .populate('requester', 'name phone')
      .populate('acceptedBy.donor', 'name phone bloodGroup')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BloodRequest.countDocuments(filter);

    res.json({
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get accepted requests error:', error);
    res.status(500).json({ error: 'Failed to get accepted requests', details: error.message });
  }
});

module.exports = router;
