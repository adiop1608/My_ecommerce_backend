const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  price: { type: Number, min: [0, "Wrong  Price"], required: true },
  discount: {
    type: Number,
    min: [0, "Wrong Min Discount"],
    max: [50, "Wrong Max Discount"],
  },
  rating: {
    type: Number,
    min: [0, "Wrong Min Rating"],
    max: [5, "Wrong Max Rating"],
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock cannot be negative"],
  },
  color: {
    type: [String], // Assuming multiple colors
  },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  cardImage: { type: String, required: true },
  productPageImages: [String],
},{ timestamps: true });
const Product = mongoose.model("Product", productSchema);
module.exports.Product = Product;
