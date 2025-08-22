const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Blood group is required']
  },
  units: {
    type: Number,
    required: [true, 'Number of units is required'],
    min: [1, 'At least 1 unit is required'],
    max: [10, 'Maximum 10 units per request']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  hospital: {
    name: {
      type: String,
      required: [true, 'Hospital name is required']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    phone: String
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: undefined
    }
  },
  requiredDate: {
    type: Date,
    required: [true, 'Required date is needed']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required']
    },
    phone: {
      type: String,
      required: [true, 'Contact person phone is required']
    },
    relationship: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'expired'],
    default: 'pending'
  },
  acceptedBy: [{
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    acceptedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['accepted', 'donated', 'cancelled'],
      default: 'accepted'
    }
  }],
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String,
  isUrgent: {
    type: Boolean,
    default: false
  },
  tags: [String], // For categorizing requests (e.g., 'cancer', 'surgery', 'accident')
  attachments: [{
    filename: String,
    url: String,
    type: String
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
bloodRequestSchema.index({ location: '2dsphere' });

// Index for status and urgency queries
bloodRequestSchema.index({ status: 1, urgency: 1, requiredDate: 1 });

// Virtual for checking if request is expired
bloodRequestSchema.virtual('isExpired').get(function() {
  return new Date() > this.requiredDate;
});

// Virtual for getting accepted donors count
bloodRequestSchema.virtual('acceptedDonorsCount').get(function() {
  return this.acceptedBy.length;
});

// Method to check if user can accept this request
bloodRequestSchema.methods.canAccept = function(userId) {
  // Check if user has already accepted this request
  const alreadyAccepted = this.acceptedBy.some(acceptance => 
    acceptance.donor.toString() === userId.toString()
  );
  
  return !alreadyAccepted && this.status === 'pending';
};

// Method to accept request
bloodRequestSchema.methods.acceptRequest = function(userId) {
  if (!this.canAccept(userId)) {
    throw new Error('Cannot accept this request');
  }
  
  this.acceptedBy.push({
    donor: userId,
    acceptedAt: new Date(),
    status: 'accepted'
  });
  
  // If enough donors have accepted, change status to in-progress
  if (this.acceptedBy.length >= this.units) {
    this.status = 'in-progress';
  }
  
  return this.save();
};

// Method to complete donation
bloodRequestSchema.methods.completeDonation = function(userId) {
  const acceptance = this.acceptedBy.find(acc => 
    acc.donor.toString() === userId.toString() && acc.status === 'accepted'
  );
  
  if (!acceptance) {
    throw new Error('No pending acceptance found for this user');
  }
  
  acceptance.status = 'donated';
  
  // Check if all donations are completed
  const allDonated = this.acceptedBy.every(acc => acc.status === 'donated');
  if (allDonated) {
    this.status = 'completed';
    this.completedAt = new Date();
  }
  
  return this.save();
};

// Static method to find nearby requests
bloodRequestSchema.statics.findNearby = function(coordinates, maxDistance = 50000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    status: { $in: ['pending', 'in-progress'] }
  }).populate('requester', 'name phone');
};

// Ensure virtual fields are serialized
bloodRequestSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
