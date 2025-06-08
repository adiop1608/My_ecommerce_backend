const express = require('express');
const payment_controller = require('../controller/payment_controller');
const router = express.Router();

router
    .post('/create-order',payment_controller.makePayment)
    
module.exports = router;