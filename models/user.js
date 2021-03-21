const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;
const { Schema } = mongoose;


//Defining User Schema
const UserSchema = new Schema({
  name: String,
  email:{
    type: String,
    required: true,
    index: true,
  },
  role:{
    type: String,
    default:"subscriber",  
  },
  cart: {
    type: Array,
    default: []
  },
  address: String,
  //wishlist: [{type:ObjectId, ref:"Product"}],
},
{timestamps: true})

//User Collection
const User = mongoose.model("User", UserSchema);


module.exports = User;