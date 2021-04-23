import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  amount: {
    type: Number,
    unique: true,
  },
  price: {
    type: Number,
    unique: true,
  },
});
module.exports = mongoose.model("product", productSchema);
