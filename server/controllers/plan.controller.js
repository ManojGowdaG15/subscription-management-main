const Plan = require('../models/Plan');

// @desc    Get all active plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.json({
      success: true,
      count: plans.length,
      plans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single plan
// @route   GET /api/plans/:id
// @access  Public
const getPlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.json({
      success: true,
      plan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new plan
// @route   POST /api/plans
// @access  Private/Admin
const createPlan = async (req, res, next) => {
  try {
    const { name, description, price, duration, features } = req.body;

    const plan = await Plan.create({
      name,
      description,
      price,
      duration,
      features
    });

    res.status(201).json({
      success: true,
      plan
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Plan with this name already exists'
      });
    }
    next(error);
  }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
const updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.json({
      success: true,
      plan
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Plan with this name already exists'
      });
    }
    next(error);
  }
};

// @desc    Delete plan (soft delete)
// @route   DELETE /api/plans/:id
// @access  Private/Admin
const deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Soft delete - just mark as inactive
    plan.isActive = false;
    await plan.save();

    res.json({
      success: true,
      message: 'Plan deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan
};