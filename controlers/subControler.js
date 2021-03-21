
const slugify = require("slugify");
const Sub = require("../models/sub");
const Product = require("../models/product");

exports.create = async (req, res)=>{
  try {
    const { name, parent } = req.body;
    console.log("name of the Sub",name, parent);
    const sub = await Sub.create({name, slug: slugify(name), parent})
    res.json(sub);
  } catch (error) {
    res.status(400).send("Sub creation Failed");
  }
}

exports.list = async(req, res)=>{
  res.json(await Sub.find({}).sort({ createdAt:-1 }).exec());
}

exports.read = async(req, res)=>{
  let sub = await Sub.findOne({slug: req.params.slug}).exec()
  let products = await Product.find({ subs:sub })
  res.json(
    {sub,
    products}
  );
}


exports.update = async(req, res)=>{
  try {
    const { name, parent } = req.body;
    const updated = await Sub.findOneAndUpdate(
      {slug:req.params.slug},
      {name, slug: slugify(name), parent},
      {new: true}
    )
    res.json(updated);

  } catch (error) {
    res.status(401).send("Update failed")
  }
}

exports.remove = async(req, res)=>{
  try {
    //console.log("remove executed")
    const deleted = await Sub.findOneAndDelete({slug: req.params.slug}).exec();
    res.json(deleted);
  } catch (error) {
    res.status(401).send("Sub Creation Failed");
  }
}