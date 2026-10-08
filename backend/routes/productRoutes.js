const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// Public catalog endpoints
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-protected product operations
router.post('/', authenticateUser, requireAdmin, createProduct);
router.put('/:id', authenticateUser, requireAdmin, updateProduct);
router.delete('/:id', authenticateUser, requireAdmin, deleteProduct);

module.exports = router;
