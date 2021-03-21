const slugify = require("slugify");
const Product = require("../models/product");
const User = require("../models/user");

exports.create = async (req, res)=>{
  try {
    req.body.slug = slugify(req.body.title);
    const { title, description} = req.body;
    console.log("name of the category",req.body);
    const product = await Product.create(req.body)
    res.json(product);
  } catch (err) {
    res.status(401).json({
      err: err.message,
    });
  }
}

exports.list = async (req,res) => {
  //console.log(req.params)
  const products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([['createdAt', "desc"]])
    .exec();
  res.json(products);
}


exports.remove = async (req, res) => {
  try {
    console.log("Triggered remove");
    let deleted = await Product.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);

  } catch (err) {
    res.status(401).json({
      err: err.message,
    });
  }
}

exports.read = async (req,res) => {
  console.log(req.params.slug)
  const product = await Product.findOne({slug: req.params.slug})
    .populate("category")
    .populate("subs")
    .exec();
  res.json(product);
}

exports.update = async (req,res) => {
  const {title} = req.body;
  
  const updated = await Product.findOneAndUpdate(
    {slug: req.params.slug},
    {...req.body, slug: slugify(title)},
    {new: true})
    
  res.json(updated);
}

exports.listConditionally = async (req, res) => {
  const { sort, order, page}= req.body;
  let currentpage = page || 1;
  let perPage = 3 ;
  try {
    const products = await Product.find({})
    .skip((currentpage-1)*perPage)
    .populate("category")
    .populate("subs")
    .sort([[sort, order]])
    .limit(perPage)
    .exec()

    res.json(products);

  } catch (error) {
    res.json(error);
  }
}

//for total products amount
exports.totalProducts = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
}


exports.productStar = async(req, res) => {
  const { star } = req.body;
  //console.log("email", req.user)
  let product = await Product.findById(req.params.productId).exec();
  var user = await User.findOne({email: req.user.email}).exec();

  let existingRatingObject = product.rating.find((elem)=> elem.postedBy.toString() === user._id.toString());

  if(existingRatingObject === undefined){
    let ratingAdded = await Product.findByIdAndUpdate(req.params.productId,
      { $push: { rating: { star, postedBy: user._id } }},
      {new:true}
      ).exec();
    console.log("Added rating");
    res.json(ratingAdded);
  }else{
    let ratingUpdated = await Product.updateOne({
      rating:{ $elemMatch : existingRatingObject }},
      { $set: { "rating.$.star": star}},
      { new: true}
    ).exec();

    res.json(ratingUpdated);
  }

}

exports.relatedProducts= async (req, res) => {
  console.log("ID", req.params.productId)
  let product = await Product.findById(req.params.productId).exec();
  console.log(product.category)
  let relatedProducts = await Product.find({
    _id: { $ne: product._id},
    category: product.category
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .exec()
  res.json(relatedProducts)
}

//fucntion for filtered search / query search
//helper functions
const handleQuery =async (req,res, query)=>{
  console.log("THis is the second func");
  const products = await Product.find({ $text: {$search: query}})
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();
  res.json(products);
}

const handlePrice = async(req, res, price)=>{
  console.log("THis is price function");
  const products = await Product.find({
    price:{
      $gte:price[0],
      $lte:price[1]}
  })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec()

  res.json(products);
}

const handleCategory = async(req, res, category) =>{
  try {
    let products = await Product.find({category})
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec()
    res.json(products);
    
  } catch (error) {
    
  }
}

const handleStars = (req, res, stars)=>{
  Product.aggregate([
    {
      $project:{
        document: "$$ROOT",
        floarAverage:{
          $floor :{ $avg: "$rating.star"}
        }
      }
    },
    { $match: { floarAverage: stars} }
  ])
    .limit(12)
    .exec((err, aggregates)=>{
      if(err) console.log("Aggrigate Error 1", err);
      console.log("Aggregations", aggregates)
      Product.find({_id: aggregates})
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec((err, products)=>{
        if(err) console.log("Aggrigate Error 2", err);
        res.json(products);
      })
    })
}

const handleSub = async (req, res, sub) => {
  try {
    let products = await Product.find({subs: sub})
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec()
     res.json(products);
  } catch (error) {
  }
}

const handleBrand= async (req, res, brand) => {
  let products = await Product.find({brand})
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec()
     res.json(products);
}

const handleColor= async (req, res, color) => {
  let products = await Product.find({color})
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec()
     res.json(products);
}
const handleShipping= async (req, res, shipping) => {
  let products = await Product.find({shipping})
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec()
     res.json(products);
}

// main end-point
exports.searchFilter = async (req, res) => {
  console.log(req.body);
  
  const { query, price, category, stars, sub, brand, color, shipping }= req.body;
  if(query){
    await handleQuery(req,res,query);
  }

  if(price != undefined){
    await handlePrice(req, res, price);
  }
  
  if(category){
    await handleCategory(req, res, category)
  }

  if(stars){
    console.log("Stars----->", stars)
    handleStars(req, res, stars);
  }
  if(sub){
    await handleSub(req, res, sub)
  }
  if(brand){
    await handleBrand(req, res, brand)
  }
  if(color){
    await handleColor(req, res, color)
  }
  if(shipping){
    await handleShipping(req, res, shipping)
  }

}