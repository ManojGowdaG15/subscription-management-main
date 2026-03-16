const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'CANCELLED', 'EXPIRED', 'UPGRADED'],
    default: 'ACTIVE'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'SIMULATED_SUCCESS', 'FAILED'],
    default: 'SIMULATED_SUCCESS'
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  cancelledAt: Date,
  pricePaid: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

// Method to check if subscription is expired
subscriptionSchema.methods.isExpired = function () {
  return new Date() > this.endDate;
};

// Static method to update expired subscriptions
subscriptionSchema.statics.updateExpired = async function () {
  const now = new Date();
  return await this.updateMany(
    { endDate: { $lt: now }, status: 'ACTIVE' },
    { status: 'EXPIRED' }
  );
};

module.exports = mongoose.model('Subscription', subscriptionSchema);