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
    const existedCategory = await categoryService.getOne({
      name: categoryName,
    });
    if (existedCategory) {
      throw new BaseError({
        name: categoryName,
        httpCode: statusCode.ALREADY_EXITS,
        description: errorList.ALREADY_EXITS,
      });
    }
    const category = await categoryService.create({
      name: categoryName,
    });
    responseSuccess(res, 201, category);
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const option = { session, new: true };
  try {
    const categoryId = req.params.categoryId;
    const category = await categoryService.getOne({_id:categoryId});
    if(!category){
      throw new BaseError({
        name: categoryId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    await Promise.all([
      categoryService.findOneAndDisable({ _id: categoryId }, option),
      productService.findOneAndDisable({ categoryId: categoryId }, option),
    ]);
    await session.commitTransaction();
    responseSuccess(res, 204, categoryId);
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
    if (!categories.length) {
      throw new BaseError({
        name: categories,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, 200, categories);
  } catch (error) {
    next(error);
  }
};
const getAllProduct = async (req, res, next) => {
  try {
    const query = req.query;
    const listProduct = await productService.get(query);
    if (!listProduct.length) {
      throw new BaseError({
        name: categoryId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, 200, listProduct);
  } catch (error) {
    next(error);
  }
};
const updateCategory = async (req, res, next) => {
  try {
    const newName  = req.body.newName;
    const categoryId = req.params.categoryId;
    const [existedCategory, existedNewName] = await Promise.all([
      categoryService.getOne({ _id: categoryId }),
      categoryService.getOne({ name: newName }),
    ]);
    if (!existedCategory) {
      throw new BaseError({
        name: categoryId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    if (existedNewName) {
      throw new BaseError({
        name: categoryId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.ALREADY_EXITS,
      });
    }
    await categoryService.findOneAndUpdate(
      { _id: categoryId },
      { name: newName }
    );
    responseSuccess(res, 200, { name, newName });
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
