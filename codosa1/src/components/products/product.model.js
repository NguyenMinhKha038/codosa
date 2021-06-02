import mongoose from "mongoose";
import statusMiddleWare from "../utils/status";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
    min: 0,
  },
  price: {
    type: Number,
    require: true,
    min: 0,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref:'category',
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  status: {
    type: Number,
    require: true,
    default:statusMiddleWare.productStatus.ACTIVE,
    max:1,
    min:0
  },
  image: {
    type:Array,
    default:null
  }
});
const productModel = mongoose.model("product", productSchema);
export default productModel;
