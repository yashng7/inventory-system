const express = require('express');
const router = express.Router();
const {
  createSaleFromCart,
  createSale,
  getAllSales,
  getSale,
  getMySales,
  getSalesStats
} = require('../controllers/salesController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Customer routes
router.post('/checkout', protect, createSaleFromCart);
router.get('/my/history', protect, getMySales);

// Staff/Admin routes
router.post('/', protect, authorize('staff', 'admin'), createSale);
router.get('/', protect, authorize('staff', 'admin'), getAllSales);
router.get('/stats/summary', protect, authorize('staff', 'admin'), getSalesStats);

// Get single sale (any authenticated user with proper authorization)
router.get('/:id', protect, getSale);

module.exports = router;