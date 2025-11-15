const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  updateStock
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Admin only routes
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

// Admin & Staff routes
router.get('/alerts/low-stock', protect, authorize('admin', 'staff'), getLowStockProducts);
router.patch('/:id/stock', protect, authorize('admin', 'staff'), updateStock);

module.exports = router;