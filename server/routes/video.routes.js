const express = require('express');
const router = express.Router();
const {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  trackProgress,
  getWatchHistory
} = require('../controllers/video.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { checkTierAccess } = require('../middleware/access.middleware');

// Public routes
router.get('/', getVideos);
router.get('/history', protect, getWatchHistory);
router.get('/:id', protect, checkTierAccess(), getVideo);

// Protected routes
router.post('/:id/progress', protect, trackProgress);

// Admin routes
router.post('/', protect, admin, createVideo);
router.put('/:id', protect, admin, updateVideo);
router.delete('/:id', protect, admin, deleteVideo);

module.exports = router;
