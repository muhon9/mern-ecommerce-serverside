const User = require("../models/user");



exports.createUpdateUser = async (req,res)=>{
  const {name, email, picture} = req.user;
  const user = await User.findOneAndUpdate({email},{name: email.split('@')[0], picture},{new: true});
  
  if(user){
    
    res.json(user);
  }
  else{
    const newUser = await User.create({
      email,
      name: email.split('@')[0],
      picture
    })
    console.log("New user created");
    res.json(newUser);
  }
}

exports.currentUser = async (req,res)=>{
  
  const { email } = req.user;
  const user = await User.findOne({email});
  res.json(user);
}