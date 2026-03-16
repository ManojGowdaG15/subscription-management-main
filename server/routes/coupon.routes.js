const express = require('express');
const router = express.Router();
const { validateCoupon, createCoupon, getCoupons, deleteCoupon } = require('../controllers/coupon.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.post('/validate', protect, validateCoupon);

// Admin only routes
router.use(protect, admin);
router.route('/')
    .get(getCoupons)
    .post(createCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
