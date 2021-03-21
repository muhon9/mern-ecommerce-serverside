const express = require("express");
const router = express.Router();

const { createCoupon, getCoupon, removeCoupon } = require("../controlers/couponControler");
const { applyCoupon } = require("../controlers/userControler");
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");

router.get('/user/coupon', getCoupon);
router.post('/user/coupon', authCheck, createCoupon);
router.post('/user/couponapply', authCheck, applyCoupon);
router.delete('/user/coupon/:couponId',authCheck, adminCheck, removeCoupon);




module.exports = router;