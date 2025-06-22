const express = require('express');
const server = express();
const cors = require('cors')
server.use(cors({
  origin: 'https://shopsphere-dc9vbf0tj-aadityas-projects-3e0afe5a.vercel.app',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
require('dotenv').config()
server.use(express.json());
const { default: mongoose } = require("mongoose");
const productRouter = require('./routes/product.route');
const AuthRouter = require('./routes/user.route');
const CartRouter = require('./routes/cart.route');
const OrderRouter = require('./routes/order.route');
const PaymentRouter = require('./routes/payment.route');
const PORT = process.env.PORT;
const { auth, adminAuth } = require('./middleware/auth');


main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('database connected')
}



server.use('/api/auth',AuthRouter);
server.use('/api/products',productRouter);
server.use('/api/cart',auth,CartRouter);
server.use('/api/order',auth,OrderRouter);
server.use('/api/payment',auth,PaymentRouter);

server.listen(PORT||3000,()=>{
  console.log(`Server Started at Port ${PORT}`);
});