const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  robotId: { type: String, required: true },
  name:    { type: String, required: true },
  price:   { type: Number, required: true },
  image:   { type: String, default: '' },
  qty:     { type: Number, required: true, default: 1 }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items:  { type: [CartItemSchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', CartSchema);
