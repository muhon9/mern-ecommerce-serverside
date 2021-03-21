const mongoose = require("mongoose");


const { ObjectId } = mongoose.Schema;



const productSchema = new mongoose.Schema({

  title:{
    type: String,
    trim: true,
    maxlength: 2000,
    required: true,
    text: true
  },

  slug:{
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },

  description: {
    type: String,
    required: true,
    maxlength: 2000,
    text: true,
  },

  price: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 20
  },  

  category: {
    type: ObjectId,
    ref: "Category"
  },

  subs: [
    {
      type: ObjectId,
      ref: "Sub"
    }
  ],

  quantity:{
    type: Number,
  },

  sold:{
    type: Number,
    default: 0
  },

  images: {
    type: Array
  },

  shipping: {
    type: String,
    enum: ["Yes","No"]
  },

  color: {
    type: String,
    enum: ["Black","Red","White","Blue","Silver"]
  },

  brand: {
    type: String,
    enum: ["Apple","Samsung","ASUS","MSI","Lenovo"]
  },

  rating:[
    {
      star: Number,
      postedBy:{ type: ObjectId, ref: "User" }
    }
  ]
}, {timestamps: true})

const Product =  mongoose.model("Product", productSchema);

module.exports = Product;