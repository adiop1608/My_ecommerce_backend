const jwt = require('jsonwebtoken');
const express = require('express');
const { createUser, validateUser } = require('../controller/authorization');
const { loginUser } = require('../controller/authorization');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { createAddress, updateAddress, deleteAddress, getAllAddresses, getUser, countUser, getAllUser, updateRole } = require('../controller/userController');
const publicKey = fs.readFileSync(path.resolve(__dirname,'../public.key'),'utf-8');
const { auth, adminAuth } = require('../middleware/auth');

router
    .post("/signup",createUser) 
    .post("/login",loginUser)
    .get("/all",auth,getAllUser)
    .get("/count",auth, countUser)
    .post("/validate",auth,validateUser)
    .post("/addaddress",auth,createAddress)
    .patch("/address/:id",auth,updateAddress)
    .delete("/address/:id",auth,deleteAddress)
    .get("/address",auth,getAllAddresses)
    .put('/role/:userId',updateRole)
    .get("/:id",auth,getUser)


module.exports = router;
