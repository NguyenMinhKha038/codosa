import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { cartService } from "./cart.service";
import { productService } from "../products/product.service";
const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const carts = await cartService.getOne(
      {
        userId: userId,
      },
      { populate: "product.productId" }
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
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const option = { session, new: true };
  try {
    const product = req.body.product;
    const userId = req.user._id;
    for (const value of product) {
      const productExits = await productService.getOne(
        {
          _id: value.productId,
        },
        { populate: "product.productId", option }
      );
      if (productExits === null) {
        throw new BaseError({
          name: userId,
          httpCode: statusCode.NOT_FOUND,
          description: "No product exists " + value.productId,
        });
      } else if (productExits.quantity === 0) {
        throw new BaseError({
          name: userId,
          httpCode: statusCode.NOT_FOUND,
          description: productExits.name + " Out of stock ",
        });
      } else if (value.quantity > productExits.quantity) {
        throw new BaseError({
          name: userId,
          httpCode: statusCode.NOT_FOUND,
          description: productExits.name + " Exceed the number of existence ",
        });
      }
    }
    await cartService.findOneAndUpdate(
      { userId: userId },
      { product: product },
      option
    );
    await session.commitTransaction();
    responseSuccess(res, product);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default { getCart, addCart };
