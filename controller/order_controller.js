const Cart = require('../models/cart.model');
const Order = require('../models/order.model');


exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { selectedAddress, paymentMethod } = req.body; // get from frontend

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const order = new Order({
      userId,
      products: cart.products,
      address: selectedAddress,
      paymentMethod,
      subtotal: cart.subtotal,
      totalDiscount: cart.totalDiscount,
    });

    await order.save();

    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: 'Order placed successfully', order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


exports.updateOrder = async(req,res)=>{

try {
    const { id } = req.params;
    const updateData = req.body; 
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Failed to update" });
  }
}

exports.getAllUserorder = async(req,res)=>{
  try{
    const userId = req.user.userId;
    const order = await Order.find({ userId: userId });
    res.status(200).json(order);
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Failed to fetch orders"});
  }
}
exports.getAllOrder = async(req,res)=>{
  try{
    const orders = await Order.find()
      .populate({ path: 'userId', select: 'email' });
    res.status(200).json(orders);
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Failed to fetch orders"});
  }
}
exports.getSalesData = async (req, res) => {
  try {

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$subtotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(salesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch sales data" });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" },
        },
      },
      {
        $sort: { totalSold: -1 }
      },
      { $limit: 5 }, // Top 5 selling products
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      {
        $unwind: "$productInfo"
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$productInfo.name",
          totalSold: 1,
          cardImage: "$productInfo.cardImage",
          price: "$productInfo.price"
        }
      }
    ]);

    res.status(200).json(topProducts);
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({ message: "Failed to fetch top-selling products" });
  }
};

exports.countOrder = async(req,res)=>{
  try{
    const count = await Order.countDocuments({});
    res.status(201).json({totalOrders:count});
  }catch(error){
    console.error("Error counting Orders:", error);
    res.status(500).json("Server Error");

  }
}