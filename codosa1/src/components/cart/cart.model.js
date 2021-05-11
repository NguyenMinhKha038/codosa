import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartModel = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      require:true,
      ref:'user'
    },
    product: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "product",
          default:null
        },
        amount: {
          type: Number,
          min: 0,
          default:0
        }
      },
    ],
  },
  { colection: "cart" }
);

export default mongoose.model("cart", cartModel);
