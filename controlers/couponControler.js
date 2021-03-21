const Coupon = require("../models/coupon");

exports.createCoupon = async (req, res) => {
  try {
    const { name, discount, expiry } = req.body.coupon;
    const coupon = await Coupon.create({name, discount, expiry});
    res.json(coupon);
  } catch (error) {
    res.status(404).json(error);
  }
}

exports.removeCoupon = async (req, res) => {
  
  const coupon = await Coupon.findByIdAndRemove(req.params.couponId).exec();
  res.json(coupon);

}

exports.getCoupon = async (req, res) => {
  const coupons = await Coupon.find({}).exec();
  res.json(coupons);
}

//apply coupon is in the cartControler