const express = require('express');
const router = express.Router();
const Cart  = require('../models/Cart');
const Order = require('../models/Order');
const auth  = require('../middleware/auth');

// GET /api/cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    // Check if any order EXISTS for this specific userId
    const existingOrder = await Order.findOne({ userId: req.user._id });
    const isNewUser = !existingOrder;
    
    console.log(`[ELIGIBILITY] User: ${req.user.email} | ID: ${req.user._id} | Has Previous Order: ${!!existingOrder} | isNewUser: ${isNewUser}`);

    res.json({ 
      items: cart ? cart.items : [],
      isNewUser: isNewUser
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart.' });
  }
});

// POST /api/cart/add
router.post('/add', auth, async (req, res) => {
  try {
    const { robotId, name, price, image, qty = 1 } = req.body;
    if (!robotId || !name || !price)
      return res.status(400).json({ message: 'robotId, name and price are required.' });

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = new Cart({ userId: req.user._id, items: [] });

    const idx = cart.items.findIndex(i => i.robotId === robotId);
    if (idx >= 0) {
      cart.items[idx].qty += qty;
    } else {
      cart.items.push({ robotId, name, price, image: image || '', qty });
    }
    cart.updatedAt = new Date();
    await cart.save();
    res.json({ items: cart.items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add to cart.' });
  }
});

// DELETE /api/cart/remove
router.delete('/remove', auth, async (req, res) => {
  try {
    const { robotId } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.json({ items: [] });
    cart.items = cart.items.filter(i => i.robotId !== robotId);
    cart.updatedAt = new Date();
    await cart.save();
    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item.' });
  }
});

// DELETE /api/cart/clear
router.delete('/clear', auth, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], updatedAt: new Date() },
      { upsert: true }
    );
    res.json({ items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart.' });
  }
});

module.exports = router;
