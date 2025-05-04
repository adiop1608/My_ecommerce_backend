const express = require('express');
const cartController = require('../controller/cart_Controller');
const router = express.Router();
router
    .get('/', cartController.getCart)
    .post('/add', cartController.addToCart)
    .put('/update-quantity', cartController.updateQuantity)
    .put('/remove-product', cartController.removeProduct)
    
module.exports = router;