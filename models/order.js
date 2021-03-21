const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const orderSchema = new mongoose.Schema({

  products : [
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
  paymentIntent: {},
  orderStatus:{
    type: String,
    default: "Not Processed",
    enum:[
      "Not Processed",
      "Processing",
      "Dispatched",
      "Canceled",
      "Delivered"
    ],
  },
  
  orderedBy:{
    type: ObjectId,
    ref:"User"
  }

}, {timestamps:true})

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

