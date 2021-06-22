import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { cartService } from "./cart.service";
import { productService } from "../products/product.service";
import mongoose from "mongoose";
const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.getOne(
      {
        userId: userId,
      },
      null,
      { populate: "product.productId" }
    );
    if (!cart.products.length) {
      throw new BaseError({
        name: userId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.CART_EMPTY,
      });
    }
    responseSuccess(res, 200, cart.products);
  } catch (error) {
    next(error);
  }
};
const addCart = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const option = { session, new: true };
  try {
    const products = req.body.products;
    const userId = req.user._id;
    await checkProducts(products, option);
    const cart = await cartService.getOne({ userId: userId }, null, option);
    const productsOfCart = cart.products;
    const newProductsOfCart = productsOfCart.concat(products);
    await cartService.findOneAndUpdate(
      { userId: userId },
      { products: newProductsOfCart },
      option
    );
    await session.commitTransaction();
    responseSuccess(res, 200, newProductsOfCart);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
const updateCart = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const option = { session, new: true };
  try {
    const products = req.body.products;
    const userId = req.user._id;
    await checkProducts(products, option);
    await cartService.findOneAndUpdate(
      { userId},
      { products: products },
      option
    );
    await session.commitTransaction();
    responseSuccess(res, 200, products);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
const checkProducts = async (products, option) => {
  for (const value of products) {
    const product = await productService.getOne(
      {
        _id: value.productId,
      },
      null,
      option
    );
    if (!product ) {
      throw new BaseError({
        name: value.productId,
        httpCode: statusCode.NOT_FOUND,
        description: "No product exists " + value.productId,
      });
    }
    if (product.quantity <= 0) {
      throw new BaseError({
        name: value.productId,
        httpCode: statusCode.NOT_FOUND,
        description: product.name + " Out of stock ",
      });
    }
    if (value.quantity > product.quantity) {
      throw new BaseError({
        name: value.productId,
        httpCode: statusCode.NOT_FOUND,
        description: product.name + " Exceed the number of existence ",
      });
    }
  }
};
export default { getCart, addCart, updateCart };
