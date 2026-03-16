const Video = require('../models/Video');
const Subscription = require('../models/Subscription');

// Check if user has access to specific video's tier
const checkTierAccess = () => {
  return async (req, res, next) => {
    try {
      const videoId = req.params.id;
      const video = await Video.findById(videoId);

      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'Video not found'
        });
      }

      const requiredTier = video.accessTier || 'basic';

      // Public videos (basic tier) - always accessible for viewing (some platforms might require login even for basic, but we'll follow this for now)
      if (requiredTier === 'basic') {
        req.video = video;
        return next();
      }

      // Check if user is authenticated for higher tiers
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Identity verification required for this transmission'
        });
      }

      // Get user's active subscription
      const subscription = await Subscription.findOne({
        user: req.user.id,
        status: 'ACTIVE'
      }).populate('plan');

      if (!subscription) {
        return res.status(403).json({
          success: false,
          message: 'Active protocol required: No subscription detected',
          requiredTier
        });
      }

      // Define tier hierarchy
      const tierHierarchy = {
        'basic': 1,
        'premium': 2,
        'pro': 3
      };

      const userTier = subscription.plan.name.toLowerCase();
      const userTierLevel = tierHierarchy[userTier] || 1;
      const requiredTierLevel = tierHierarchy[requiredTier] || 1;

      // Check if user's tier meets requirements
      if (userTierLevel >= requiredTierLevel) {
        req.userTier = userTier;
        req.subscription = subscription;
        req.video = video;
        return next();
      } else {
        return res.status(403).json({
          success: false,
          message: `Tier Insufficient: ${requiredTier.toUpperCase()} access required`,
          requiredTier,
          currentTier: userTier
        });
      }
    } catch (error) {
      next(error);
    }
  };
};

// Get available qualities based on user tier
const getAvailableQualities = (userTier) => {
  const qualityMap = {
    'basic': ['360p', '480p'],
    'premium': ['360p', '480p', '720p', '1080p'],
    'pro': ['360p', '480p', '720p', '1080p', '4K']
  };
  return qualityMap[userTier] || qualityMap.basic;
};

// Check if user can watch in specific quality
const checkQualityAccess = (quality) => {
  return (req, res, next) => {
    const userTier = req.userTier || 'basic';
    const availableQualities = getAvailableQualities(userTier);

    if (availableQualities.includes(quality)) {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message: `Your plan doesn't support ${quality} quality`,
        availableQualities
      });
    }
  };
};

module.exports = {
  checkTierAccess,
  checkQualityAccess,
  getAvailableQualities
};
