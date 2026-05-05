const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new order request
// @route   POST /api/orders
// @access  Private (Customer)
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const order = new Order({
      customer: req.user.id,
      items,
      totalAmount,
      status: 'pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders
// @access  Private (Customer)
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    console.log('Fetching orders for user:', userId);
    
    const orders = await Order.find({ customer: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Order history fetch error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Customer)
router.get('/:id', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const order = await Order.findOne({ _id: req.params.id, customer: userId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
