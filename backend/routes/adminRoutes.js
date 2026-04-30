const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all pending users
// @route   GET /api/admin/users/pending
// @access  Private/Admin
router.get('/users/pending', protect, admin, async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      role: 'customer',
      $or: [
        { status: 'pending' },
        { status: { $exists: false } }
      ]
    }).select('-__v');
    res.json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Approve a pending user
// @route   PUT /api/admin/users/:id/approve
// @access  Private/Admin
router.put('/users/:id/approve', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'approved';
    await user.save();

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Reject a pending user
// @route   PUT /api/admin/users/:id/reject
// @access  Private/Admin
router.put('/users/:id/reject', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'rejected';
    await user.save();

    res.json({ message: 'User rejected successfully', user });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all pending orders
// @route   GET /api/admin/orders/pending
// @access  Private/Admin
router.get('/orders/pending', protect, admin, async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: 'pending' })
      .populate('customer', 'name email')
      .populate('items.product', 'name price stock')
      .sort({ createdAt: -1 });
    res.json(pendingOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Approve order and subtract stock
// @route   PUT /api/admin/orders/:id/approve
// @access  Private/Admin
router.put('/orders/:id/approve', protect, admin, async (req, res) => {
  try {
    const { adminMessage } = req.body;

    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'pending') return res.status(400).json({ message: 'Order already processed' });

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product ? product.name : 'Unknown Product'}` });
      }
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Explicitly update status AND message
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', adminMessage: adminMessage || '' },
      { new: true }
    );

    res.json({ message: 'Order approved and inventory updated', order: updatedOrder });
  } catch (error) {
    console.error('Order approval error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Reject order
// @route   PUT /api/admin/orders/:id/reject
// @access  Private/Admin
router.put('/orders/:id/reject', protect, admin, async (req, res) => {
  try {
    const { adminMessage } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', adminMessage: adminMessage || '' },
      { new: true }
    );
    
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order rejected', order: updatedOrder });
  } catch (error) {
    console.error('Order rejection error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
