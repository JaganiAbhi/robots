const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// A simple simulated processing delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// @route   POST /api/payment/process
router.post('/process', async (req, res) => {
  const { amount, cardNumber, cardName, expiry, cvv, userId, cartItems } = req.body;

  if (!amount || !cardNumber || !cardName) {
    return res.status(400).json({ success: false, message: 'Missing required payment details.' });
  }

  // Simulate a 2.5 second processing time to show loading animation in frontend
  await delay(2500);

  // Strip spaces from card number for logic check
  const cleanCard = cardNumber.replace(/\s/g, '');

  let isSuccess = false;
  let message = '';

  // Logic: 
  // 4111 -> Success
  // 0000 -> Decline
  // Otherwise -> Random (70% success)
  if (cleanCard.startsWith('4111')) {
    isSuccess = true;
    message = 'Payment successful.';
  } else if (cleanCard.startsWith('0000')) {
    isSuccess = false;
    message = 'Card declined by the issuing bank.';
  } else {
    isSuccess = Math.random() > 0.3;
    message = isSuccess ? 'Payment successful.' : 'Card declined.';
  }

  const transactionId = isSuccess ? `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null;

  try {
    // If successful, save order
    const order = new Order({
      userId: userId || 'guest',
      cartItems,
      amount,
      cardName,
      status: isSuccess ? 'paid' : 'failed',
      transactionId
    });

    // We do not wait for DB save failure to stop mock experience if DB isn't running
    mongooseSave(order);

    if (isSuccess) {
      return res.json({ success: true, transactionId, message, order });
    } else {
      return res.status(400).json({ success: false, message });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error processing payment.' });
  }
});

// Helper for soft-saving (doesn't crash if Mongo is unreachable in mock mode)
async function mongooseSave(order) {
  try {
    await order.save();
  } catch (e) {
    console.log("Mongo save skipped (Not connected)");
  }
}

// @route   POST /api/payment/verify
router.post('/verify', async (req, res) => {
  const { transactionId } = req.body;
  try {
    const order = await Order.findOne({ transactionId });
    if (!order) return res.status(404).json({ success: false, message: 'Transaction not found.' });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
