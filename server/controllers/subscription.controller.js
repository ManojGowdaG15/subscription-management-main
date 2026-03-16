const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

// @desc    Subscribe to a plan
// @route   POST /api/subscriptions/subscribe/:planId
// @access  Private
const subscribe = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { couponCode } = req.body;
    const userId = req.user.id;

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found or inactive'
      });
    }

    // Check if user already has active subscription (Allow upgrade)
    const activeSubscription = await Subscription.findOne({
      user: userId,
      status: 'ACTIVE'
    });

    if (activeSubscription) {
      // If same plan, don't allow
      if (activeSubscription.plan.toString() === planId) {
        return res.status(400).json({
          success: false,
          message: 'You are already connected to this tier'
        });
      }

      // Mark old as upgraded
      activeSubscription.status = 'UPGRADED';
      activeSubscription.endDate = new Date();
      await activeSubscription.save();
    }

    // Calculate end date based on plan duration
    const startDate = new Date();
    const endDate = new Date();

    if (plan.duration === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Calculate final price with coupon if provided
    let finalPrice = plan.price;
    let discountPercent = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() }
      });

      if (coupon) {
        // Check usage limit
        if (coupon.usageLimit === -1 || coupon.usedCount < coupon.usageLimit) {
          discountPercent = coupon.discountPercentage;
          finalPrice = plan.price * (1 - (discountPercent / 100));

          // Increment coupon usage
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    // Create subscription
    const subscription = await Subscription.create({
      user: userId,
      plan: planId,
      startDate,
      endDate,
      pricePaid: finalPrice.toFixed(2),
      discountPercentage: discountPercent,
      status: 'ACTIVE',
      paymentStatus: 'SIMULATED_SUCCESS'
    });

    // Update user's current subscription
    await User.findByIdAndUpdate(userId, {
      currentSubscription: subscription._id
    });

    // Populate plan details
    await subscription.populate('plan');

    res.status(201).json({
      success: true,
      subscription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel subscription
// @route   POST /api/subscriptions/cancel
// @access  Private
const cancelSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const subscription = await Subscription.findOne({
      user: userId,
      status: 'ACTIVE'
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    subscription.status = 'CANCELLED';
    subscription.autoRenew = false;
    subscription.cancelledAt = new Date();
    await subscription.save();

    // Remove from user's current subscription
    await User.findByIdAndUpdate(userId, {
      currentSubscription: null
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's current subscription
// @route   GET /api/subscriptions/me
// @access  Private
const getMySubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: 'ACTIVE'
    }).populate('plan');

    if (!subscription) {
      return res.json({
        success: true,
        subscription: null,
        message: 'No active subscription'
      });
    }

    // Check if expired
    if (subscription.isExpired()) {
      subscription.status = 'EXPIRED';
      await subscription.save();

      // Remove from user
      await User.findByIdAndUpdate(req.user.id, {
        currentSubscription: null
      });

      return res.json({
        success: true,
        subscription: null,
        message: 'Subscription expired'
      });
    }

    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get subscription history
// @route   GET /api/subscriptions/history
// @access  Private
const getSubscriptionHistory = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id })
      .populate('plan')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: subscriptions.length,
      subscriptions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribe,
  cancelSubscription,
  getMySubscription,
  getSubscriptionHistory
};