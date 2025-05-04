const mongoose = require("mongoose");
const { Schema } = mongoose;
const addressSchema = new Schema({
    
    firstName : String,
    lastName:String,
    phoneNumber:{type:Number , match: /^[0-9]{10}$/},
    street:String,
    city:String,
    state:String,
    pinCode:Number,
    country:String
})
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String,minLength:6, required: true },
  role:{
    type:String,
    enum:['Admin','User'],
    default:'User'
  },
  addresses:[addressSchema]

},{timestamps:true});

const User = mongoose.model('User',userSchema);
module.exports.User = User
