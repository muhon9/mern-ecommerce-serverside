const express = require("express");


const { list, create, read, update, remove, getSubs } = require("../controlers/categoryControler");
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");
const router = express.Router();





router.post('/category',authCheck, adminCheck, create);
router.get('/categories',list);
router.get('/category/:slug', read);
router.put('/category/:slug',authCheck, adminCheck, update);
router.delete('/category/:slug',authCheck, adminCheck, remove);
router.get('/category/subs/:_id', getSubs);


module.exports = router;



