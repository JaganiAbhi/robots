const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  robotId: String,
  name:    String,
  price:   Number,
  image:   String,
  qty:     Number
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  fullName : { type: String, default: '' },
  phone    : { type: String, default: '' },
  line1    : { type: String, default: '' },
  line2    : { type: String, default: '' },
  city     : { type: String, default: '' },
  state    : { type: String, default: '' },
  pincode  : { type: String, default: '' }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId          : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items           : { type: [OrderItemSchema], required: true },
  subtotal        : { type: Number, required: true },
  gst             : { type: Number, required: true },
  discount        : { type: Number, default: 0 },
  total           : { type: Number, required: true },
  paymentMethod   : { type: String, enum: ['UPI', 'COD'], required: true },
  paymentStatus   : { type: String, enum: ['SUCCESS', 'PENDING', 'FAILED'], default: 'SUCCESS' },
  transactionId   : { type: String },
  shippingAddress : { type: AddressSchema, default: {} },
  createdAt       : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
