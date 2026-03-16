const express = require('express');
const router = express.Router();
const { 
  subscribe, 
  cancelSubscription, 
  getMySubscription,
  getSubscriptionHistory
} = require('../controllers/subscription.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

router.post('/subscribe/:planId', subscribe);
router.post('/cancel', cancelSubscription);
router.get('/me', getMySubscription);
router.get('/history', getSubscriptionHistory);

module.exports = router;