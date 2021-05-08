import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  product: [{
    type:Array,
    require: true,
  }],
  status: {
    type: Number,
    require: true,
  },
  createDay: {
    type: Date,
    require: true,
  },
  updateDay: Date,
  deliveryDay: Date,
  finishDay: Date,
  total: {
    type:Number,
    min:0
  },
  address: {
    type:String,
    require:true
  },
});
module.exports = mongoose.model("order", orderSchema);
