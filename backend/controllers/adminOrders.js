const Order = require('../models/Orders');

// GET /api/admin/orders - Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'userName email') // Include user info
      .populate('items.productId', 'title image') // Include product info
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Admin getAllOrders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

// GET /api/admin/orders/:id - Get a single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'userName email')
      .populate('items.productId', 'title image');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Admin getOrderById error:', error);
    res.status(500).json({ success: false, message: 'Failed to get order' });
  }
};

// GET /api/admin/orders/stats/dashboard - Get order statistics for admin dashboard
const getOrderStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    // Total orders and revenue
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Today's stats
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });
    const todayRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // This week's stats
    const weekOrders = await Order.countDocuments({
      createdAt: { $gte: thisWeek }
    });

    // This month's stats
    const monthOrders = await Order.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    // Orders by day for the last 7 days
    const last7Days = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .populate('userId', 'userName email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        total: {
          orders: totalOrders,
          revenue: totalRevenue[0]?.total || 0
        },
        today: {
          orders: todayOrders,
          revenue: todayRevenue[0]?.total || 0
        },
        thisWeek: {
          orders: weekOrders
        },
        thisMonth: {
          orders: monthOrders
        },
        last7Days,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Admin getOrderStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order statistics' });
  }
};

// PUT /api/admin/orders/:id/status - Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ') 
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'userName email')
     .populate('items.productId', 'title image');

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Admin updateOrderStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderStats,
  updateOrderStatus
};
