const { json } = require("body-parser");
const Order = require("../models/order")



exports.getAllOrders = async (req, res) => {
  
  //console.log("Process Env", process.env.CLOUDINARY_CLOUD_NAME);
  let allOrders = await Order.find({})
    .populate('products.product')
    .sort("-createdAt")
    .exec();
  //console.log("-----", allOrders);
  res.json(allOrders);
}

exports.orderStatus = async (req, res) => {
  let { orderId, orderStatus } = req.body;
  let updated = await Order.findByIdAndUpdate(orderId,
    {orderStatus},
    {new: true})

  res.json(updated);
}
