const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getStats,
  deactivateUserSubscription
} = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// All routes are protected and admin only
router.use(protect, admin);

router.get('/users', getUsers);
router.get('/stats', getStats);
router.put('/users/:userId/deactivate-subscription', deactivateUserSubscription);

module.exports = router;