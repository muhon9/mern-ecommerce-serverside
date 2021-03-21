const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  products:[
    {
      product:{
        type:ObjectId, 
        ref:"Product"
      },
      color: String,
      count: Number,
      price: Number
    }
  ],
  total: Number,
  totalAfterDiscount: Number,
  orderedBy:{
    type: ObjectId,
    ref:"User"
  }
}, {timestamps: true});


const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;