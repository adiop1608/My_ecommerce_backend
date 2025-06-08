const { configDotenv } = require("dotenv");
const Razorpay = require("razorpay");
configDotenv;
const razorpayid = process.env.RAZORPAY_KEY_ID;
const razorpaySecret = process.env.RAZORPAY_SECRET;

const razorpay = new Razorpay({
  key_id: razorpayid,
  key_secret: razorpaySecret,
});

exports.makePayment = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
  };
  console.log(options)
  try {
    const order = await razorpay.orders.create(options);
    console.log(options);
    res.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (err) {
    res.status(500).json({ err });
  }
};
