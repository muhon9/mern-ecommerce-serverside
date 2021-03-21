const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const couponSchema = new mongoose.Schema({

  name:{
    type: String,
    trim: true,
    required: "Coupon Name is required",
    minlength: [5, "Too Short"],
    uppercase: true,
    unique: true
  },

  discount:{
    type: Number,
    required: true
  },

  expiry:{
    type: Date,
    required: true
  }

}, {timestamps: true});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;