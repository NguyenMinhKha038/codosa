import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
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
      throw new BaseError({
        name: userId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.CART_EMPTY,
      });
    }
    responseSuccess(res, carts.product);
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
        throw new BaseError({
          name: userId,
          httpCode: statusCode.NOT_FOUND,
          description: "No product exists " + value.productId,
        });
      } else if (checkExits.amount == 0) {
        throw new BaseError({
          name: userId,
          httpCode: statusCode.NOT_FOUND,
          description: checkExits.name + " Out of stock ",
        });
      } else if (value.amount > checkExits.amount) {
        throw new BaseError({
          name: userId,
          httpCode: statusCode.NOT_FOUND,
          description: checkExits.name + " Exceed the number of existence ",
        });
      }
    }
    await cartService.findOneAndUpdate(
      { userId: userId },
      { product: product }
    );
    responseSuccess(res, product);
  } catch (error) {
    next(error);
  }
};

export default { getCart, addCart };
