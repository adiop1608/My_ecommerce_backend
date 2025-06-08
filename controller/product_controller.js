const model = require("../models/product.model");
const { default: mongoose } = require("mongoose");
const Product = model.Product;

exports.createproduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save(); 
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllProducts = async (req, res) => {
    const products =  await Product.find({});
     res.json(products);
}
exports.filterProducts = async (req, res) => {
    try {
    const { category, brand } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
}
exports.pageProducts = async (req, res) => {
      try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    res.status(500).json({ message: "Server error" });
  }
}


exports.getProduct = async (req, res) => {
  const { id } = req.params;

  // Validate ID before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.updateProduct = async(req,res)=>{

  const { id } = req.params;
  const updateData = req.body; 
try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Failed to update" });
  }
}
exports.deleteProduct = async(req,res)=>{

  const { id } = req.params;
try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(deleteProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Failed to update" });
  }
}

exports.countProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ totalproducts: count });
  } catch (error) {
    console.error("Error counting products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchProducts = async (req,res)=>{
  const query = req.query.q || "";
  try{
    const products = await Product.find({
      name:{$regex:query , $options:"i"},
    })
    res.status(200).json(products);
  }catch(err){
    console.error(err);
    res.status(400).json({error:"Search Bar Failed"})
  }
}