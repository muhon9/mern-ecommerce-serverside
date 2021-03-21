const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");

const Product = require("../models/product");
const User = require("../models/user");

exports.user = (req,res)=>{
  res.json({
    "msg":"this is userRoutes"
  })
}


exports.getCart = async (req, res) => {
  
  const user = await User.findOne({ email: req.user.email}).exec();
  //console.log("Triggered");
  //console.log("User", req.email);
  const cart = await Cart.findOne({orderedBy: user._id}).populate("products.product").exec();
  if(cart){
    const { products, total, totalAfterDiscount } = cart;
    res.json({products, total, totalAfterDiscount});
  }
  
  
}


exports.userCart = async (req, res) => {
  //console.log("User Cart req data", req.user);
  const { cart } = req.body;
  const user = await User.findOne({ email: req.user.email}).exec();

  let products = [];
  for(let i=0; i< cart.length; i++){
    let object = {};
    object.product = cart[i]._id;
    object.color = cart[i].color;
    object.count = cart[i].count;
    const { price } = await Product.findById(cart[i]._id).select("price").exec();
    object.price = price;
    products.push(object);
  }

  let cartAlreadySaved = await Cart.findOne({orderedBy: user._id}).exec();
  if(cartAlreadySaved){
    cartAlreadySaved.remove();
    //console.log("Removed Old Cart");
  }
  let total= 0;
  for(let i=0; i< products.length; i++){
    total += products[i].price * products[i].count;
  }
  let discount = 0;
  let totalAfterDiscount= total - discount;
  
  const cartSaved = await Cart.create({products, total, totalAfterDiscount, orderedBy: user._id});
  res.json({ok: true});
}


exports.applyCoupon = async (req, res) => {
  const { couponName } = req.body;
  const couponExist = await Coupon.findOne({name: couponName}).exec();
  if(couponExist){
    const user = await User.findOne({ email: req.user.email}).exec();
    const cart = await Cart.findOne({orderedBy: user._id}).populate("products.product").exec();
    const { total } = cart;
    const totalAfterDiscount = (total -(total*(couponExist.discount/100))).toFixed(2);
    await Cart.findOneAndUpdate({orderedBy: user._id},
          {totalAfterDiscount}).exec();
    res.json(totalAfterDiscount);
  }else{
    res.json({error: "No coupon found"});
  }
}




exports.emptyCart = async (req, res) => {
  const user = await User.findOne({email: req.user.email}).exec();
  const cart = await Cart.findOneAndRemove({orderedBy: user._id}).exec();
  res.json(cart);
}


exports.addAddress = async (req, res) => {
  //console.log("received address", req.body)
  const address = await User.findOneAndUpdate({email: req.user.email},
    {address: req.body.address}).exec();
  res.json(address);
}

// controler for order

exports.createOrder =async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email}).exec();
  const cart = await Cart.findOne({orderedBy: user._id}).exec();
  const { products } = cart;
  console.log("USer id", )
  const newOrder = await Order.create({
    products,
    paymentIntent,
    orderedBy: user._id,
  })

  var bulkOption = products.map((item)=>{
    return {
      updateOne : {
        filter: { _id: item.product._id  },
        update: { $inc: { quantity: -item.count , sold: +item.count }}
      }
    }
  })

  Product.bulkWrite(bulkOption, {});

  res.json({ok: true});
}


//get orders for the logged in user

exports.getOrders = async (req, res) => {
  console.log("received req")
  const user = await User.findOne({ email: req.user.email}).exec();
  const orders = await Order.find({ orderedBy: user._id })
    .populate("products.product")
    .exec();

  res.json(orders);
}
