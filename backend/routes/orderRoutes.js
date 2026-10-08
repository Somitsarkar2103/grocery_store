const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// Order endpoints
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

// Admin-protected order status update
router.patch('/:id/status', authenticateUser, requireAdmin, updateOrderStatus);

module.exports = router;
