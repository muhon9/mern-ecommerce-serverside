const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const stripe = require('stripe')('sk_test_51ITOtyA0YpsHZEM89iXNZ8q4uf1MkVAkF77dvid8mmg3fGIIA4cVLV7fd5c3U7mCGOzLh1AU0NzQgOjon7T87Cj600xJaLXt4z');


exports.createPaymentIntent = async (req, res) => {

  const { coupon } = req.body;
  const user = await User.findOne({ email: req.user.email}).exec();

  const cart = await Cart.findOne({orderedBy: user._id}).populate("products.product").exec();
  console.log("cart total", cart.total);
  const {total, totalAfterDiscount} = cart;
  
  

  let finalAmount = 0;

  if(coupon){
    finalAmount= totalAfterDiscount;
  }else{
    finalAmount= total;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: (finalAmount*100),
    currency: "usd"
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    total,
    totalAfterDiscount,
    payable: finalAmount
  });
}