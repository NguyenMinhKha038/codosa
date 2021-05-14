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
    name:{
      type:String,
      require:true,
      max:30,
    },
    amount: {
      type:Number,
      require:true,
      min:0
    },
    price:{
      type:Number,
      min:0
    },
    category:{
      type:String,
      require:true
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
    require:true,
    min:5,
    max:50
  },
  phone:{
    type:String,
    length:10
  }

},{timestamps:true});
export default mongoose.model("order", orderSchema);
