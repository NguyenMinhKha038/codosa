import cart from "./cart.model";
import productModel from "../products/product.model";
import mongoose from "mongoose";
import cartValidate from "./cart.validate";

const getCart = async (req, res, next) => {
  const id = req.user._id;
  try {
    const carts = await cart
      .findOne({ userId: id })
      .populate("product.productId");
    if (!carts) {
      res.status(400).json({ Message: "Cart is Emty" });
    } else {
      res.status(200).json({ Cart: carts.product });
    }
  } catch (error) {
    next(error);
  }
};
const addCart = async (req, res, next) => {
  const { product, phone, address } = req.body;
  const { email, _id } = req.user;
  console.log(typeof product);
  try {
    for (const value of product) {
      const checkExits = await productModel
        .findOne({ _id: value.productId })
        .populate("product.productId");
      if (checkExits == null) {
        return res
          .status(400)
          .json({ message: "No product exists " + value.productId });
      } else if ((checkExits.amount = 0)) {
        return res
          .status(400)
          .json({ message: checkExits.name + " Out of stock " });
        
      } 
     
    }
    await cart.findOneAndUpdate(
      { userId: _id },
      { product: product, phone: phone, address: address }
    );
    return res.status(200).json({ cart: product });
  } catch (error) {
    next(error);
  }
};

export default { getCart, addCart };
