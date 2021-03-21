
const slugify = require("slugify");
const Category = require("../models/category");
const Sub = require("../models/sub");
const Product = require("../models/product");


exports.create = async (req, res)=>{
  try {
    const { name } = req.body;
    //console.log("name of the category",req.body);
    const category = await Category.create({name, slug: slugify(name)})
    res.json(category);
  } catch (error) {
    res.status(400).send("Category creation Failed");
  }
}

exports.list = async(req, res)=>{
  res.json(await Category.find({}).sort({ createdAt:-1 }).exec());
}

exports.read = async(req, res)=>{
  let category = await Category.findOne({slug: req.params.slug}).exec()
  let products = await Product.find({ category })
  res.json({
    category,
    products
  });
}


exports.update = async(req, res)=>{
  try {
    const { name } = req.body;
    const updated = await Category.findOneAndUpdate(
      {slug:req.params.slug},
      {name, slug: slugify(name)},
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
    const deleted = await Category.findOneAndDelete({slug: req.params.slug}).exec();
    res.json(deleted);
  } catch (error) {
    res.status(401).send("Category Creation Failed");
  }
}

exports.getSubs = async(req, res)=>{
  console.log("---req", req.params._id);
  res.json(await Sub.find({parent: req.params._id}).exec());
}