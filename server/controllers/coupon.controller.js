const Coupon = require('../models/Coupon');

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expiryDate: { $gt: new Date() }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or expired campaign voucher'
            });
        }

        if (coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Campaign limit reached for this voucher'
            });
        }

        res.json({
            success: true,
            coupon: {
                code: coupon.code,
                discountPercentage: coupon.discountPercentage
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create coupon (Admin only)
const createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({ success: true, coupon });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all coupons (Admin only)
const getCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json({ success: true, coupons });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete coupon (Admin only)
const deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Voucher not found' });
        }
        res.json({ success: true, message: 'Voucher deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateCoupon,
    createCoupon,
    getCoupons,
    deleteCoupon
};
