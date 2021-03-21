const express = require("express");
const { getAllOrders, orderStatus } = require("../controlers/adminControler");
const { adminCheck, authCheck } = require("../middlewares/authMiddleware");

const router = express.Router();


router.get('/admin/orders',authCheck, adminCheck, getAllOrders);
router.put('/admin/order-status',authCheck, adminCheck, orderStatus);



module.exports = router;