const express = require('express');
const router = express.Router();
const { 
  getPlans, 
  getPlan, 
  createPlan, 
  updatePlan, 
  deletePlan 
} = require('../controllers/plan.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getPlans);
router.get('/:id', getPlan);

// Admin routes
router.post('/', protect, admin, createPlan);
router.put('/:id', protect, admin, updatePlan);
router.delete('/:id', protect, admin, deletePlan);

module.exports = router;