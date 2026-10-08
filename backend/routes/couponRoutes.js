const express = require('express');
const router = express.Router();
const {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon
} = require('../controllers/couponController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getCoupons);
router.post('/validate', validateCoupon);

// Admin-protected endpoints
router.post('/', authenticateUser, requireAdmin, createCoupon);
router.put('/:id', authenticateUser, requireAdmin, updateCoupon);
router.delete('/:id', authenticateUser, requireAdmin, deleteCoupon);
router.patch('/:id/toggle', authenticateUser, requireAdmin, toggleCoupon);

module.exports = router;
