const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name:{
    type: String,
    trim: true,
    required: 'Name is required',
    minlength: [1, 'Too Short'],
    maxlength: [32 , 'Too Long']
  },

  slug:{
    type: String,
    unique: true,
    lowercase: true,
    index: true
  }
},{timestamps: true})


const Category = mongoose.model("Category", categorySchema);

module.exports = Category;