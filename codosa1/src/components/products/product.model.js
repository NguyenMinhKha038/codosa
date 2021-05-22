import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
    min: 0,
  },
  price: {
    type: Number,
    require: true,
    min: 0,
  },
  category: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  status: {
    type: Number,
    require: true,
  },
  image: [
    {
      type: String,
    },
  ],
});
export default mongoose.model("product", productSchema);
