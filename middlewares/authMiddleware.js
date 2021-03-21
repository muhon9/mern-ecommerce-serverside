const admin = require('../firebase');
const User = require('../models/user');


exports.authCheck = async (req, res, next)=>{
  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
    
    req.user = firebaseUser;
    //console.log("Auth Checked");
  } catch (error) {
    
     res.status(401).json({
       error: "Token Invalid",
     })
  }
  next();
}


exports.adminCheck = async (req, res, next)=>{
  //console.log("Auth check triggered",req.user);
  const {email} = req.user;
  

  const user = await User.findOne({email}).exec();
  //console.log("USer role", user.role.title);
  if(user.role !=="admin"){
    res.status(401).json({
      err: "Access Denied"
    })
  }
  else{
    next();
  }
}