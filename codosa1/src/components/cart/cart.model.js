import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "user",
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        min: 0,
        default: 0,
      },
      
    }
  ]
  
});
const cartModel = mongoose.model("cart", cartSchema);
export default cartModel;
