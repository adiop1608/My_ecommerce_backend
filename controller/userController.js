
const { User } = require("../models/user.model.js");
const mongoose = require('mongoose')
exports.createAddress = async(req,res)=>{
    const userId = req.user.userId;
    const newAddress = req.body;
    try{
        const user = await User.findByIdAndUpdate(
            userId,
            {$push: {addresses:newAddress}},
            {new:true}
        );
        res.json({message:"Address added",addresses:user.addresses});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Server error"});
    }
};

exports.updateAddress = async(req,res)=>{
    const userId = req.user.userId;
    const addressId = req.params.id;
    const update = req.body;

    try {
      const user = await User.findOneAndUpdate(
        { _id: userId, "addresses._id": addressId },
        {
          $set: {
            "addresses.$.firstName": update.firstName,
            "addresses.$.lastName": update.lastName,
            "addresses.$.phoneNumber": update.phoneNumber,
            "addresses.$.street": update.street,
            "addresses.$.city": update.city,
            "addresses.$.state": update.state,
            "addresses.$.pinCode": update.pinCode,
            "addresses.$.country": update.country
          }
        },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "Address not found or user not found" });
      }
  
      res.json({ message: "Address updated", addresses: user.addresses });
    } catch (err) {
      console.error("Update address error:", err);
      res.status(500).json({ message: "Server error" });
    }
}

exports.deleteAddress = async(req,res)=>{
    const userId = req.user.userId;
    const addressId = req.params.id;
    try{

        const user = await User.findOneAndUpdate(
            {_id:userId},
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        );
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
    
        res.json({
          message: "Address deleted successfully",
          addresses: user.addresses,
        })
    }catch (err) {
        console.error("Delete address error:", err);
        res.status(500).json({ message: "Server error" });
      }
    };

    exports.getAllAddresses = async (req, res) => {
      try {
        const user = await User.findById(req.user.userId).select("addresses");
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        res.status(200).json({ addresses: user.addresses });
      } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: "Server error" });
      }
    };

exports.getUser = async(req,res)=>{
  const {id} = req.params;
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(401).json("Id Not valid ");
  }
  try{
    const user = await User.findById(id);
    if(!user){
      return res.status(401).json("User Not Found !!");
    }
    return res.status(201).json(user)
  }catch(error){
    console.error({message:error});
  }
}

exports.getAllUser = async(req,res)=>{
  try{
    const users = await User.find();
    res.status(200).json(users);
  }catch(error){
    console.error("Error fetching users",error);
    res.status(401).json({message:"Failed to fetch Users"});
  }
}

exports.updateRole = async(req,res)=>{
  const { userId } = req.params;
  const { role } = req.body;
  console.log(userId);
  if (!['User', 'Admin'].includes(role)) {
    return res.status(400).json({ message: "Invalid role provided" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Role updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
exports.countUser = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ totalUsers: count });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

