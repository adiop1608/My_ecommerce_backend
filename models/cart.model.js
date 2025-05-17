const mongoose = require('mongoose');
const {User} = require('./user.model')
const CartProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // optional, in case you want to use populate
    required: true,
  },
  name: String,
  description: String,
  price: Number,
  discount:Number,
  cardImage: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,  // 🔥 changed from String to ObjectId
    ref: 'User',
    required: true,
    unique: true,
  },
  products: [CartProductSchema],
  subtotal: {
    type: Number,
    default: 0,
  },
  totalDiscount:{
    type:Number,
    default:0,
  }
});

module.exports = mongoose.model('Cart', CartSchema);
