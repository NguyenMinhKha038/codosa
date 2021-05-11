import cart from "./cart.model";
import product from "../products/product.model";
import mongoose from "mongoose";

const getCart = async (req, res) => {
  const email = req.user.Email;
  try {
    const carts = await cart.findOne({ id: email });
    if (!carts) {
      res.status(200).json({ Message: "Cart is Emty" });
    } else {
      res.status(200).json({ Cart: carts });
    }
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};
const addCart = async (req, res) => {
  const product= req.body;
  const { email, _id } = req.user;
  const session = await mongoose.startSession();
  try {
    
    session.startTransaction(); //start transaction
    const opts = { session, new: true };
    //const carts = await cart.findOne({ userId: _id });
    await cart.findOneAndUpdate({userId:_id},{product:product.product},opts);
    console.log( typeof product)
    await session.commitTransaction();
    return res.status(200).json({ cart: "Successful" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ Error: error });
  }
};


export default { getCart, addCart };
