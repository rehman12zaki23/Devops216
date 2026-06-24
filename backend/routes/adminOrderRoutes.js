const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getOrderStats,
  updateOrderStatus
} = require('../controllers/adminOrders');

// Optionally, you can add middleware here to check admin role
router.get('/orders', getAllOrders);
router.get('/orders/stats/dashboard', getOrderStats);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
