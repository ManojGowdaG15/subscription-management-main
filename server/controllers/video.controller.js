const Video = require('../models/Video');
const WatchHistory = require('../models/WatchHistory');
const Subscription = require('../models/Subscription');

// @desc    Get all videos (filtered by user's tier)
// @route   GET /api/videos
// @access  Public/Private
const getVideos = async (req, res, next) => {
  try {
    const { 
      category, 
      tier, 
      search, 
      trending, 
      new: isNew,
      page = 1,
      limit = 20
    } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== 'all' && category !== 'All') {
      query.category = category;
    }

    // If user is authenticated, show videos based on their tier
    let userTier = 'basic';
    if (req.user) {
      const subscription = await Subscription.findOne({
        user: req.user.id,
        status: 'ACTIVE'
      }).populate('plan');

      userTier = subscription?.plan?.name?.toLowerCase() || 'basic';
      
      // Define visible tiers based on user's subscription
      const tierHierarchy = {
        'basic': ['basic'],
        'premium': ['basic', 'premium'],
        'pro': ['basic', 'premium', 'pro']
      };

      query.accessTier = { $in: tierHierarchy[userTier] || ['basic'] };
    } else {
      // Non-authenticated users only see basic tier
      query.accessTier = 'basic';
    }

    // Filter by specific tier (admin only)
    if (tier && req.user?.role === 'admin') {
      query.accessTier = tier;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Trending videos (most viewed in last 7 days)
    if (trending === 'true') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const trendingVideos = await WatchHistory.aggregate([
        { $match: { watchedAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: '$video', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      const trendingIds = trendingVideos.map(v => v._id);
      if (trendingIds.length > 0) {
        query._id = { $in: trendingIds };
      }
    }

    // New releases
    if (isNew === 'true') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.createdAt = { $gte: thirtyDaysAgo };
    }

    const videos = await Video.find(query)
      .sort({ createdAt: -1, views: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Video.countDocuments(query);

    res.json({
      success: true,
      videos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    next(error);
  }
};

// @desc    Get single video with watch history
// @route   GET /api/videos/:id
// @access  Public/Private (with tier check)
const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Check tier access
    let userTier = 'basic';
    let progress = 0;

    if (req.user) {
      const subscription = await Subscription.findOne({
        user: req.user.id,
        status: 'ACTIVE'
      }).populate('plan');

      userTier = subscription?.plan?.name?.toLowerCase() || 'basic';

      // Get user's watch progress
      const watchHistory = await WatchHistory.findOne({
        user: req.user.id,
        video: video._id
      });
      progress = watchHistory?.progress || 0;
    }

    // Define tier hierarchy
    const tierHierarchy = {
      'basic': 1,
      'premium': 2,
      'pro': 3
    };

    const userTierLevel = tierHierarchy[userTier] || 1;
    const videoTierLevel = tierHierarchy[video.accessTier] || 1;

    // Check if user can access this video
    if (userTierLevel < videoTierLevel) {
      return res.status(403).json({
        success: false,
        message: `This video requires ${video.accessTier} subscription`,
        requiredTier: video.accessTier,
        currentTier: userTier
      });
    }

    // Define quality based on tier
    const qualityMap = {
      'basic': ['360p', '480p'],
      'premium': ['360p', '480p', '720p', '1080p'],
      'pro': ['360p', '480p', '720p', '1080p', '4K']
    };

    const availableQualities = qualityMap[userTier] || qualityMap.basic;

    // Filter video qualities
    const filteredQualities = video.qualities?.filter(q => 
      availableQualities.includes(q.label)
    ) || [];

    // Increment view count (only once per session)
    await Video.findByIdAndUpdate(video._id, {
      $inc: { views: 1 }
    });

    res.json({
      success: true,
      video: {
        ...video.toObject(),
        qualities: filteredQualities,
        userProgress: progress,
        availableQualities
      }
    });
  } catch (error) {
    console.error('Get video error:', error);
    next(error);
  }
};

// @desc    Track watch progress
// @route   POST /api/videos/:id/progress
// @access  Private
const trackProgress = async (req, res, next) => {
  try {
    const { progress, duration } = req.body;
    const videoId = req.params.id;
    const userId = req.user.id;

    console.log('Tracking progress:', { userId, videoId, progress, duration });

    let watchHistory = await WatchHistory.findOne({
      user: userId,
      video: videoId
    });

    if (watchHistory) {
      watchHistory.progress = progress;
      watchHistory.watchDuration = (watchHistory.watchDuration || 0) + (duration || 0);
      watchHistory.lastPosition = progress;
      watchHistory.watchedAt = new Date();
      
      // Mark as completed if watched 90% or more
      const video = await Video.findById(videoId);
      if (video && progress >= video.duration * 0.9) {
        watchHistory.completed = true;
      }
      
      await watchHistory.save();
    } else {
      watchHistory = await WatchHistory.create({
        user: userId,
        video: videoId,
        progress,
        lastPosition: progress,
        watchDuration: duration || 0
      });
    }

    res.json({
      success: true,
      progress: watchHistory
    });
  } catch (error) {
    console.error('Track progress error:', error);
    next(error);
  }
};

// @desc    Get watch history
// @route   GET /api/videos/history
// @access  Private
const getWatchHistory = async (req, res, next) => {
  try {
    const history = await WatchHistory.find({ user: req.user.id })
      .populate('video')
      .sort({ watchedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Get history error:', error);
    next(error);
  }
};

// @desc    Get continue watching
// @route   GET /api/videos/continue
// @access  Private
const getContinueWatching = async (req, res, next) => {
  try {
    const history = await WatchHistory.find({ 
      user: req.user.id,
      completed: false,
      progress: { $gt: 0 }
    })
      .populate('video')
      .sort({ watchedAt: -1 })
      .limit(20);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Get continue watching error:', error);
    next(error);
  }
};

// @desc    Create video (admin only)
// @route   POST /api/videos
// @access  Private/Admin
const createVideo = async (req, res, next) => {
  try {
    const video = await Video.create(req.body);

    res.status(201).json({
      success: true,
      video
    });
  } catch (error) {
    console.error('Create video error:', error);
    next(error);
  }
};

// @desc    Update video (admin only)
// @route   PUT /api/videos/:id
// @access  Private/Admin
const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      video
    });
  } catch (error) {
    console.error('Update video error:', error);
    next(error);
  }
};

// @desc    Delete video (admin only)
// @route   DELETE /api/videos/:id
// @access  Private/Admin
const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Clean up watch history
    await WatchHistory.deleteMany({ video: req.params.id });

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Delete video error:', error);
    next(error);
  }
};

module.exports = {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  trackProgress,
  getWatchHistory,
  getContinueWatching
};