import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref:'user',
    require: true,
  },
  products: [{
    productId:{
      type:Schema.Types.ObjectId,
      ref:'product',
      require:true
    },
    amount: {
      type:Number,
      require:true,
      min:0
    },
    price:{
      type:Number,
      min:0
    }
    
  }],
  status: {
    type: Number,
    require: true,
  },
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
  phone:{
    type:String,
    max:10,
    min:10
  }

},{timestamps:true});
module.exports = mongoose.model("order", orderSchema);
