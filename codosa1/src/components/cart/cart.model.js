import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartModel = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "user",
  },
  product: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
      amount: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
  ],
});

export default mongoose.model("cart", cartModel);
