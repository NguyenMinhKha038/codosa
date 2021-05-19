import cart from "./cart.model";
import productModel from "../products/product.model";


const getCart = async (req, res, next) => {
  try {
    const id = req.user._id;
    const carts = await cart
      .findOne({ userId: id })
      .populate("product.productId");
    if (!carts) {
      return res.status(400).json({ Message: "Cart is Emty" });
    } else {
      return res.status(200).json({ Cart: carts.product });
    }
  } catch (error) {
    next(error);
  }
};
const addCart = async (req, res, next) => {
  try {
    const { product} = req.body;
    const { email, _id } = req.user;
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
      }else if(value.amount>checkExits.amount){
        return res
          .status(400)
          .json({ message: checkExits.name + " Exceed the number of existence " });
      } 
    }
    await cart.findOneAndUpdate(
      { userId: _id },
      { product: product }
    );
    return res.status(200).json({ cart: product });
  } catch (error) {
    next(error);
  }
};

export default { getCart, addCart };
