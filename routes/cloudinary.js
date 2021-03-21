const express = require("express");
const { upload, remove } = require("../controlers/cloudinaryControler");



const { authCheck, adminCheck } = require("../middlewares/authMiddleware");
const router = express.Router();





router.post('/uploadimages',authCheck, adminCheck, upload);
router.post('/removeimage',authCheck, adminCheck, remove);



module.exports = router;



