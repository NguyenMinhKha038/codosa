import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartModel = new Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },
  productIds:[{
    type: mongoose.Types.ObjectId,
    ref:'product'
  }
  ]
  ,
  total: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("cart", cartModel);
