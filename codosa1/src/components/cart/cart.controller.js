import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { reponseSuccess } from "../error/baseResponese";
import cartService from "./cart.service";
import productService from "../products/product.service";
const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const carts = await cartService.findOneByAny(
      { userId: userId },
      "product.productId"
    );
    if (!carts) {
      throw new baseError(userId, statusCode.NOT_FOUND, errorList.CART_EMPTY);
    }
    reponseSuccess(res, carts.product);
  } catch (error) {
    next(error);
  }
};
const addCart = async (req, res, next) => {
  try {
    const product = req.body;
    const userId = req.user._id;
    for (const value of product) {
      const checkExits = await productService.findOneByAny(
        { _id: value.productId },
        "product.productId"
      );
      if (checkExits == null) {
        throw new baseError(
          userId,
          statusCode.NOT_FOUND,
          "No product exists " + value.productId
        );
      } else if (checkExits.amount == 0) {
        throw new baseError(
          userId,
          statusCode.NOT_FOUND,
          checkExits.name + " Out of stock "
        );
      } else if (value.amount > checkExits.amount) {
        throw new baseError(
          userId,
          statusCode.NOT_FOUND,
          checkExits.name + " Exceed the number of existence "
        );
      }
    }
    await cartService.findOneAndUpdate(
      { userId: userId },
      { product: product }
    );
    reponseSuccess(res, product);
  } catch (error) {
    next(error);
  }
};

export default { getCart, addCart };
