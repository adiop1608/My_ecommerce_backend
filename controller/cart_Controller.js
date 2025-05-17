const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

const calculateSubtotal = (products) =>
  products.reduce((total, item) => total + item.price * item.quantity, 0)

const calculateTotalDiscount = (products)=>
  products.reduce((total,item) => total + (item.price * item.discount/100),0)

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId
    let cart = await Cart.findOne({ userId })
    if (!cart) return res.json({ products: [], subtotal: 0 })
    res.json(cart)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.addToCart = async (req, res) => {
  const { productId, name, description, price, discount,cardImage } = req.body
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is missing from token" });
  }

  let cart = await Cart.findOne({ userId })
  if (!cart) {
    cart = new Cart({ userId, products: [], subtotal: 0 })
  }

  const existingProduct = cart.products.find((p) => p.productId.toString() === productId)

  if (existingProduct) {
    existingProduct.quantity += 1
  } else {
    cart.products.push({ productId, name,description, price, cardImage, discount, quantity: 1 })
  }

  cart.subtotal = calculateSubtotal(cart.products)
  cart.totalDiscount = calculateTotalDiscount(cart.products)
  await cart.save()

  res.json(cart)
}

exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body
  const userId = req.user.userId

  let cart = await Cart.findOne({ userId })
  if (!cart) return res.status(404).json({ error: 'Cart not found' })

  const product = cart.products.find((p) => p.productId.toString() === productId)
  if (!product) return res.status(404).json({ error: 'Product not found in cart' })

  if (quantity <= 0) {
    cart.products = cart.products.filter((p) => p.productId.toString() !== productId)
  } else {
    product.quantity = quantity
  }

  cart.subtotal = calculateSubtotal(cart.products)
  cart.totalDiscount = calculateTotalDiscount(cart.products)
  await cart.save()

  res.json(cart)
}

exports.removeProduct = async (req, res) => {
  const { productId } = req.body
  const userId = req.user.userId

  let cart = await Cart.findOne({ userId })
  if (!cart) return res.status(404).json({ error: 'Cart not found' })

  cart.products = cart.products.filter((p) => p.productId.toString() !== productId)
  cart.subtotal = calculateSubtotal(cart.products)
  cart.totalDiscount = calculateTotalDiscount(cart.products)
  await cart.save()

  res.json(cart)
}
