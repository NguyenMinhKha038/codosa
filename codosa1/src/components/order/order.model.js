import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  id: {
    type: String,
    unique: true,
    require: true,
  },
  product: Array,
  status: {
    type: String,
    require: true,
  },
  createDay: {
    type: Date,
    require: true,
  },
  updateDay: Date,
  deliveryDay: Date,
  finishDay: Date,
  total: Number,
  address: String,
});
module.exports = mongoose.model("order", orderSchema);
