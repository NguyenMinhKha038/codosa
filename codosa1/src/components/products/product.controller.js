import statusMiddleWare from "../utils/status";
import mongoose from "mongoose";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { reponseSuccess } from "../error/baseResponese";
import productService from "./product.service";
import categoryService from "../category/category.service";
const addProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const opts = { session, new: true };
  try {
    const { name, amount, price, category, description } = req.body;
    const checkProduct = await productService.findOneByAny({ name: name },null, opts);
    if (checkProduct) {
      throw new baseError(
        { name, amount, price, category, description },
        statusCode.ALREADY_EXITS,
        errorList.ALREADY_EXITS
      );
    }
    let newProduct = await productService.create({
      name,
      amount,
      price,
      category,
      description,
      status: statusMiddleWare.productStatus.ACTIVE,
    },opts);
    const checkCategory = await categoryService.findOneByAny(
      { name: category },null,
      opts
    );
    if (!checkCategory) {
      let newCategory = categoryService.create({
        name: category,
        status: statusMiddleWare.categoryStatus.ACTIVE,
      },opts);
      console.group("cate",newCategory)
    }
    await session.commitTransaction();
    reponseSuccess(res, newProduct);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const products = await productService.findByAny({ name: name });
    if (products) {
      reponseSuccess(res, {
        products,
      });
    }
    throw new baseError(name, statusCode.NOT_FOUND, errorList.FIND_ERROR);
  } catch (error) {
    next(errer);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const productName = req.body.name;
    const checkExits = await productService.findByAny({ name: productName });
    if (!checkExits) {
      throw new baseError(
        productName,
        statusCode.NOT_FOUND,
        errorList.FIND_ERROR
      );
    }
    await productService.findOneAndUpdate(
      { name: productName },
      { status: statusMiddleWare.productStatus.DISABLE }
    );
    reponseSuccess(res, productName);
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const opts = { session, new: true };
  try {
    const { name, amount, price, newName, productId } = req.body;
    const checkExits = await productService.findByAny({ _id: productId }, opts);
    if (!checkExits) {
      throw new baseError(name, statusCode.NOT_FOUND, errorList.FIND_ERROR);
    }
    await productService.findByIdAndUpdate(
      { _id: productId },
      { name: newName, amount: amount, price: price },
      opts
    );
    await session.commitTransaction();

    reponseSuccess(res, { newName, amount, price });
  } catch (error) {
    next(error);
  }
};

export default { addProduct, getProduct, deleteProduct, updateProduct };
