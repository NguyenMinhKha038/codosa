import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  amount: {
    type: Number,
    required:true

  },
  price: {
    type: Number,
    required:true
    
  },
  category:{
    type:String,
    required:true
  },
  description:String,
  image:String
});
module.exports = mongoose.model("product", productSchema);
