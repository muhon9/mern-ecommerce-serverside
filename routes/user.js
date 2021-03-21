const express = require("express");
const router = express.Router();

const { userCart, getCart, emptyCart, addAddress, createOrder, getOrders } = require("../controlers/userControler");
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");


router.get('/user/cart', authCheck, getCart);
router.post('/user/cart', authCheck, userCart );
router.post('/user/order', authCheck, createOrder);
router.get('/user/orders', authCheck, getOrders);
router.delete('/user/cart', authCheck, emptyCart );
router.put('/user/address', authCheck, addAddress );


module.exports = router;