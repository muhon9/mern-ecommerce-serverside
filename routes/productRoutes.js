const express = require("express");


const { authCheck, adminCheck } = require("../middlewares/authMiddleware");
const { create, list, remove, read,update, listConditionally, totalProducts, productStar, relatedProducts, searchFilter} = require("../controlers/productControler");
const router = express.Router();





router.post('/admin/product',authCheck, adminCheck, create);
// routes for total products in database
router.get('/products/total', totalProducts)

router.put('/admin/updateproduct/:slug',authCheck, adminCheck, update);
router.get('/products/:count', list);
router.delete('/product/removeproduct/:slug', authCheck, adminCheck, remove);
router.get('/product/:slug', read);

//routes for conditional product fetch
router.post('/products', listConditionally)

//routes to add rating
router.put('/product/star/:productId', authCheck, productStar)

//related products
router.get('/product/related/:productId',relatedProducts)

//Query Serach and filtering
router.post('/product/filter', searchFilter)


module.exports = router;



