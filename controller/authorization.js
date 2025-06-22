const { User } = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require('path');
const fs = require('fs');
const decode = require('jwt-decode')
const privateKey = fs.readFileSync(path.resolve(__dirname,'../private.key'),'utf-8');

exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    console.log("User Created");
    res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error creating user" });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "user does not exists" });
    }
    const isAuth = bcrypt.compareSync(password, user.password);
    if (!isAuth) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "2h",
    });
    console.log("Generated Token:", token);

    res.status(200).json({ user, token });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.validateUser = async (req, res) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token);

    if (!decoded.userId||!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const currentTime = Math.floor(Date.now() / 1000); 
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({ message: "Token has expired, please log in again" });
    }
    jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    return res.status(200).json({ message: "Token is Valid", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
