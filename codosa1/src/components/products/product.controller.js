import statusMiddleWare from "../utils/status";
import mongoose from "mongoose";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import {productService} from "./product.service";
import {categoryService} from "../category/category.service";
const addProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const option = { session, new: true };
  try {
    const { name, amount, price, category, description } = req.body;
    const checkProduct = await productService.findOneByAny({ name: name },null, option);
    if (checkProduct) {
      throw new BaseError(
        {name:{ name, amount, price, category, description },
        httpCode:statusCode.ALREADY_EXITS,
        description:errorList.ALREADY_EXITS}
      );
    }
    let newProduct = await productService.create({
      name,
      amount,
      price,
      category,
      description,
      status: statusMiddleWare.productStatus.ACTIVE,
    },option);
    const checkCategory = await categoryService.findOneByAny(
      { name: category },null,
      option
    );
    if (!checkCategory) {
      await categoryService.create({
        name: category,
        product:newProduct._id,
        status: statusMiddleWare.categoryStatus.ACTIVE,
      },option);
      
    }
    let newCategoryListProduct = [...checkCategory.product];
    newCategoryListProduct.push(newProduct._id)
    await categoryService.findOneAndUpdate({ name: category },{product:newCategoryListProduct}),option;
    await session.commitTransaction();
    responseSuccess(res, newProduct);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const product = await productService.findOneByAny({ name: name });
    if (product) {
      responseSuccess(res, {
        product,
      });
    }
    throw new BaseError({name:name, httpCode:statusCode.NOT_FOUND, description:errorList.FIND_ERROR});
  } catch (error) {
    next(error);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const productName = req.body.name;
    const checkExits = await productService.findByAny({ name: productName });
    if (!checkExits) {
      throw new BaseError(
        {name:productName,
        httpCode:statusCode.NOT_FOUND,
        description:errorList.FIND_ERROR}
      );
    }
    await productService.findOneAndUpdate(
      { name: productName },
      { status: statusMiddleWare.productStatus.DISABLE }
    );
    responseSuccess(res, productName);
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const option = { session, new: true };
  try {
    const { name, amount, price, newName, productId } = req.body;
    const checkExits = await productService.findByAny({ _id: productId }, option);
    if (!checkExits) {
      throw new BaseError({name:name, httpCode:statusCode.NOT_FOUND, description:errorList.FIND_ERROR});
    }
    await productService.findByIdAndUpdate(
      { _id: productId },
      { name: newName, amount: amount, price: price },
      option
    );
    await session.commitTransaction();

    responseSuccess(res, { newName, amount, price });
  } catch (error) {
    next(error);
  }
};

export default { addProduct, getProduct, deleteProduct, updateProduct };
