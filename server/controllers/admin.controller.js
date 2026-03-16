const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const searchQuery = search
      ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
      : {};

    const users = await User.find(searchQuery)
      .select('-password')
      .populate({
        path: 'currentSubscription',
        populate: { path: 'plan' }
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(searchQuery);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    // Update expired subscriptions
    await Subscription.updateExpired();

    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRegularUsers = totalUsers - totalAdmins;

    const activeSubscriptions = await Subscription.countDocuments({
      status: 'ACTIVE'
    });

    const expiredSubscriptions = await Subscription.countDocuments({
      status: 'EXPIRED'
    });

    const cancelledSubscriptions = await Subscription.countDocuments({
      status: 'CANCELLED'
    });

    // Calculate simulated revenue (from successful subscriptions)
    const subscriptions = await Subscription.find({
      paymentStatus: 'SIMULATED_SUCCESS'
    }).populate('plan');

    const totalRevenue = subscriptions.reduce((sum, sub) => {
      return sum + (sub.pricePaid || 0);
    }, 0);

    // Monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlySubscriptions = await Subscription.find({
      createdAt: { $gte: thirtyDaysAgo },
      paymentStatus: 'SIMULATED_SUCCESS'
    }).populate('plan');

    const monthlyRevenue = monthlySubscriptions.reduce((sum, sub) => {
      return sum + (sub.pricePaid || 0);
    }, 0);

    // Recent subscriptions
    const recentSubscriptions = await Subscription.find()
      .populate('user', 'name email')
      .populate('plan')
      .sort({ createdAt: -1 })
      .limit(5);

    // Plans distribution
    const plans = await Plan.find({ isActive: true });
    const plansDistribution = await Promise.all(
      plans.map(async (plan) => {
        const subs = await Subscription.find({
          plan: plan._id,
          status: 'ACTIVE'
        });
        const revenue = subs.reduce((sum, s) => sum + (s.pricePaid || 0), 0);
        return {
          planName: plan.name,
          count: subs.length,
          revenue
        };
      })
    );

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          regular: totalRegularUsers,
          admins: totalAdmins
        },
        subscriptions: {
          active: activeSubscriptions,
          expired: expiredSubscriptions,
          cancelled: cancelledSubscriptions,
          total: activeSubscriptions + expiredSubscriptions + cancelledSubscriptions
        },
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue
        },
        recentSubscriptions,
        plansDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate user subscription manually
// @route   PUT /api/admin/users/:userId/deactivate-subscription
// @access  Private/Admin
const deactivateUserSubscription = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const subscription = await Subscription.findOne({
      user: userId,
      status: 'ACTIVE'
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found for this user'
      });
    }

    subscription.status = 'CANCELLED';
    subscription.autoRenew = false;
    subscription.cancelledAt = new Date();
    await subscription.save();

    // Remove from user
    await User.findByIdAndUpdate(userId, {
      currentSubscription: null
    });

    res.json({
      success: true,
      message: 'User subscription deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getStats,
  deactivateUserSubscription
};