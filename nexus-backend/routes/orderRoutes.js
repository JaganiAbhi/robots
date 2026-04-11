const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Cart    = require('../models/Cart');
const auth    = require('../middleware/auth');

// POST /api/orders/create
router.post('/create', auth, async (req, res) => {
  try {
    const { paymentMethod, shippingAddress } = req.body;

    if (!paymentMethod || !['UPI', 'COD'].includes(paymentMethod))
      return res.status(400).json({ message: 'paymentMethod must be UPI or COD.' });

    // Require shipping address
    const addr = shippingAddress || {};
    if (!addr.fullName || !addr.phone || !addr.line1 || !addr.city || !addr.state || !addr.pincode)
      return res.status(400).json({ message: 'Complete shipping address is required.' });

    // Fetch user's cart
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty.' });

    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const gst      = Math.round(subtotal * 0.18);
    
    // Secure Backend Discount Check
    const existingOrder = await Order.findOne({ userId: req.user._id });
    const isNewUser     = !existingOrder;
    const discount      = (subtotal > 0 && isNewUser) ? 25000 : 0;
    
    console.log(`[ORDER_CREATE] User: ${req.user.email} | isNewUser: ${isNewUser} | Discount: ₹${discount}`);
    
    const total      = Math.max(0, subtotal + gst - discount);

    // Generate fake transaction ID for UPI
    const transactionId = paymentMethod === 'UPI'
      ? `NXS${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      : null;

    const order = await Order.create({
      userId:          req.user._id,
      items:           cart.items,
      subtotal,
      gst,
      discount,
      total,
      paymentMethod,
      paymentStatus:   'SUCCESS',
      transactionId,
      shippingAddress: addr
    });

    // Clear cart after successful order
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], updatedAt: new Date() }
    );

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order.' });
  }
});

// GET /api/orders/user
router.get('/user', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

module.exports = router;
