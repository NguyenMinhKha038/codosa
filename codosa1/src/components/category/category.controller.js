import statusMiddleWare from "../utils/status";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { categoryService } from "./category.service";
import { productService } from "../products/product.service";
import mongoose from "mongoose";
const addCategory = async (req, res, next) => {
  try {
    const categoryName = req.body.category;
    const categoryExits = await categoryService.getOne({
      condition: {
        name: categoryName,
      },
    });
    if (categoryExits) {
      throw new BaseError({
        name: categoryName,
        httpCode: statusCode.ALREADY_EXITS,
        description: errorList.ALREADY_EXITS,
      });
    }
    let category = await categoryService.create({
      name: categoryName,
    });
    responseSuccess(res, category);
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const option = { session, new: true };
  try {
    const categoryId = req.params.id;
    await Promise.all([
      categoryService.findOneAndDelete({ _id: categoryId }, option),
      productService.findOneAndDelete({ categoryId: categoryId }, option),
    ]);
    await session.commitTransaction();
    responseSuccess(res, categoryId);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
const getListCategory = async (req, res, next) => {
  try {
    const categories = await categoryService.get();
    if (categories.length === 0) {
      throw new BaseError({
        name: categories,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};
const getAllProduct = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const listProduct = await productService.get({
      condition: { categoryId: categoryId },
    });
    if (listProduct.length === 0) {
      throw new BaseError({
        name: categoryId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR3b,
      });
    }
    responseSuccess(res, listProduct);
  } catch (error) {
    next(error);
  }
};
const updateCategory = async (req, res, next) => {
  try {
    const { name, newName } = req.body;
    const categoryId = req.params.id;
    await categoryService.findOneAndUpdate(
      { _id: categoryId },
      { name: newName },
    );
    responseSuccess(res, { name, newName });
  } catch (error) {
    next(error);
  }
};
export default {
  addCategory,
  deleteCategory,
  getListCategory,
  updateCategory,
  getAllProduct,
};
