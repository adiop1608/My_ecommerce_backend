const express = require('express');
const server = express();
const cors = require('cors')
server.use(cors({ origin: "http://localhost:5173", credentials: true }));
require('dotenv').config()
server.use(express.json());
const { default: mongoose } = require("mongoose");
const path = require('path');
const productRouter = require('./routes/product.route');
const AuthRouter = require('./routes/user.route');
const CartRouter = require('./routes/cart.route');
const OrderRouter = require('./routes/order.route');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const { auth, adminAuth } = require('./middleware/auth');


const publicKey = fs.readFileSync(path.resolve(__dirname,'./public.key'),'utf-8');

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('database connected')
}



server.use('/api/auth',AuthRouter);
server.use('/api/products',productRouter);
server.use('/api/cart',auth,CartRouter);
server.use('/api/order',auth,OrderRouter);
server.listen(8080,()=>{
  console.log('Server Started at Port 8080');
});