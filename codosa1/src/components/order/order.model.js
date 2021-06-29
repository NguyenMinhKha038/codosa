import mongoose from "mongoose";
import statusMiddleWare from "../utils/status";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
          min: 1,
        },
        price: {
          type: Number,
          require: true,
          min: 0,
        },
      },
    ],
    status: {
      type: Number,
      require: true,
      default: statusMiddleWare.orderStatus.WAITING,
      min: 0,
      max: 4,
    },
    deliveryDay: {
      type: Date,
      default: null,
    },
    finishDay: {
      type: Date,
      default: null,
    },
    total: {
      type: Number,
      require: true,
      min: 0,
    },
    address: {
      type: String,
      require: true,
      min: 5,
      max: 100,
    },
    phone: {
      type: String,
      require: true,
      length: 10,
    },
  },
  { timestamps: true }
);
const orderModel = mongoose.model("order", orderSchema);
export default orderModel;