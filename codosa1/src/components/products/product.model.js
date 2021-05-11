import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  amount: {
    type: Number,
    required: true, 
    min:0
  },
  price: {
    type: Number,
    required: true,
    min:0
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type:String,
    require:true
  },
  status:{
    type:Number,
    require:true
  },
  image: Array,
});
module.exports = mongoose.model("product", productSchema);
