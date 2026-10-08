const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  getMe,
  getUsers,
  updateUserRole
} = require('../controllers/authController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);

// Authenticated user endpoints
router.get('/me', authenticateUser, getMe);

// Admin-only user management endpoints
router.get('/users', authenticateUser, requireAdmin, getUsers);
router.patch('/users/:id/role', authenticateUser, requireAdmin, updateUserRole);

module.exports = router;
