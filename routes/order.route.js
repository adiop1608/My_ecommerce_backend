const express = require('express');
const orderController = require('../controller/order_controller')
const router = express.Router();

router
    .post("/",orderController.createOrder)
    .get('/count',orderController.countOrder)
    .get('/orders',orderController.getAllUserorder)
    .get('/all',orderController.getAllOrder)
    .get('/sales',orderController.getSalesData)
    .get('/topsell',orderController.getTopSellingProducts)
    .put('/status/:id',orderController.updateOrder);
module.exports = router;