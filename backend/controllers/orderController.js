const Order = require('../models/Orders'); 

// Simple in-memory rate limiting for order creation
const orderCreationRequests = new Map();
const REQUEST_WINDOW = 5000; // 5 seconds

const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, sessionId } = req.body;

    // Validate required fields
    if (!userId || !items || !totalAmount || !sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: userId, items, totalAmount, sessionId' 
      });
    }

    // Rate limiting check - prevent duplicate requests within 5 seconds
    const requestKey = `${userId}_${sessionId}`;
    const lastRequest = orderCreationRequests.get(requestKey);
    const now = Date.now();
    
    if (lastRequest && (now - lastRequest) < REQUEST_WINDOW) {
      console.log(`Rate limited order creation for ${requestKey}`);
      return res.status(429).json({
        success: false,
        message: 'Order creation request too frequent. Please wait a moment.'
      });
    }
    
    orderCreationRequests.set(requestKey, now);
    
    // Clean up old entries (optional)
    for (let [key, timestamp] of orderCreationRequests.entries()) {
      if (now - timestamp > REQUEST_WINDOW) {
        orderCreationRequests.delete(key);
      }
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Items array is required and cannot be empty' 
      });
    }

    // Validate each item
    for (let item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0 || !item.price || item.price <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Each item must have valid productId, quantity, and price' 
        });
      }
    }

    // Check for existing order with same sessionId to prevent duplicates
    const existingOrder = await Order.findOne({ sessionId });
    if (existingOrder) {
      console.log('Order already exists for sessionId:', sessionId);
      return res.status(200).json({ 
        success: true, 
        message: 'Order already exists - no duplicate created', 
        order: existingOrder,
        isDuplicate: true
      });
    }

    // Calculate total to verify
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + (item.salePrice || item.price) * item.quantity;
    }, 0);

    // Allow small floating point differences
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({ 
        success: false, 
        message: 'Total amount mismatch' 
      });
    }

    // Create new order
    const newOrder = await Order.create({ 
      userId, 
      items, 
      totalAmount: calculatedTotal, 
      sessionId 
    });

    console.log('Order created successfully:', newOrder._id);
    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully', 
      order: newOrder 
    });
    
  } catch (err) {
    console.error("Create Order Error:", err);
    
    // Handle duplicate key error specifically
    if (err.code === 11000 && err.keyPattern?.sessionId) {
      return res.status(200).json({ 
        success: true, 
        message: 'Order already exists for this session' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while creating order' 
    });
  }
};

// GET /api/order/user/:userId - Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const orders = await Order.find({ userId })
      .populate('items.productId', 'title image price')
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('getUserOrders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user orders' });
  }
};

module.exports = { createOrder, getUserOrders }