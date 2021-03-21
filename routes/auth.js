const express = require("express");
const { createUpdateUser, currentUser } = require("../controlers/authControler");
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");
const router = express.Router();




router.post('/auth',authCheck, createUpdateUser);
router.post('/current-user',authCheck, currentUser);
router.post('/current-admin',authCheck, adminCheck, currentUser);


module.exports = router;



