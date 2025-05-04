const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      discount: Number,
      cardImage: String,
      quantity: Number,
    }
  ],
  address: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,
    phoneNumber: String,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    required: true,
  },
  subtotal: Number,
  totalDiscount: Number,
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid'], 
    default: 'Pending' 
  },

  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', OrderSchema);
