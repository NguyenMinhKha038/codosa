import statusMiddleWare from "../utils/status";
import mongoose from "mongoose";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { productService } from "./product.service";
import { categoryService } from "../category/category.service";
const addProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const option = { session, new: true };
  try {
    const { name, amount, price, category, description } = req.body;
    const checkProduct = await productService.getOne({
      condition: { name: name },
      option: option,
    });
    if (checkProduct) {
      throw new BaseError({
        name: { name, amount, price, category, description },
        httpCode: statusCode.ALREADY_EXITS,
        description: errorList.ALREADY_EXITS,
      });
    }
    let newProduct = await productService.create(
      {
        name,
        amount,
        price,
        category,
        description,
        status: statusMiddleWare.productStatus.ACTIVE,
      },
      option
    );
    const checkCategory = await categoryService.getOne({
      condition: { name: category },
      option: option,
    });
    let newCategoryListProduct = [];
    if (!checkCategory) {
      await categoryService.create(
        {
          name: category,
          product: newProduct._id,
          status: statusMiddleWare.categoryStatus.ACTIVE,
        },
        option
      );
    } else {
      newCategoryListProduct = [...checkCategory.product];
    }
    newCategoryListProduct.push(newProduct._id);
    await categoryService.findOneAndUpdate(
      { name: category },
      { product: newCategoryListProduct }
    ),
      option;
    await session.commitTransaction();
    responseSuccess(res, newProduct);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await productService.getOne({
      condition: { _id: productId },
    });
    if (product) {
      responseSuccess(res, {
        product,
      });
    }
    throw new BaseError({
      name: productId,
      httpCode: statusCode.NOT_FOUND,
      description: errorList.FIND_ERROR,
    });
  } catch (error) {
    next(error);
  }
};
const deleteProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const option = { session, new: true };
  try {
    const producId = req.params.id;
    const checkExits = await productService.getOne({
      condition: { _id: producId },
      option: option,
    });
    if (!checkExits) {
      throw new BaseError({
        name: producId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    const product = await productService.findOneAndDelete(
      { _id: producId },
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
const updateProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const option = { session, new: true };
  try {
    const { amount, price, newName, description } = req.body;
    const productId = req.params.id;
    const checkExits = await productService.getOne({
      condition: { _id: productId },
      option: option,
    });
    if (!checkExits) {
      throw new BaseError({
        name: productId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    await productService.findOneAndUpdate(
      { _id: productId },
      { name: newName, amount: amount, price: price, description: description },
      option
    );
    await session.commitTransaction();
    responseSuccess(res, { newName, amount, price });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default { addProduct, getProduct, deleteProduct, updateProduct };
