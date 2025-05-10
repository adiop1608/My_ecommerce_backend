const express = require('express');
const productController = require('../controller/product_controller')
const router = express.Router();

router
    .post("/",productController.createproduct)
    .get("/", productController.getAllProducts)
    .put("/update/:id", productController.updateProduct)
    .delete("/delete/:id", productController.deleteProduct)
    .get("/count", productController.countProducts)
    .get("/search",productController.searchProducts)
    .get("/:id", productController.getProduct);

module.exports = router;