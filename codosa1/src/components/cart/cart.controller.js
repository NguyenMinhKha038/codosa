import cart from "./cart.model";
import product from "../products/product.model";
import mongoose from "mongoose";

const getCart = async (req, res,next) => {
  const id = req.user._id;
  try {
    const carts = await cart.findOne({ userId: id }).populate("product.productId");
    if (!carts) {
      res.status(400).json({ Message: "Cart is Emty" });
    } else {
      res.status(200).json({ Cart: carts.product });
    }
  } catch (error) {
    next(error)
  }
};
const addCart = async (req, res,next) => {
  const products= req.body;
  const { email, _id } = req.user;
  const session = await mongoose.startSession();
  try {
    
    session.startTransaction(); //start transaction
    const opts = { session, new: true };
    await cart.findOneAndUpdate({userId:_id},{product:products.products},opts);
    await session.commitTransaction();
    return res.status(200).json({ cart: products.products });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error)
  }
};


export default { getCart, addCart };
