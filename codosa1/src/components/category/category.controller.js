import categoryModel from "./category.model";
import productModel from "../products/product.model";
import statusMiddleWare from "../utils/status";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {reponseSuccess} from "../error/baseResponese";
const addCategory = async (req, res, next) => {
  try {
    const categoryName = req.body.category;
    const checkCategory = await categoryModel.findOne({ name: categoryName });
    if (checkCategory) {
      throw new baseError(categoryName,statusCode.ALREADY_EXITS,errorList.ALREADY_EXITS)
    }
    let category = new categoryModel({
      name: categoryName,
      status: statusMiddleWare.categoryStatus.ACTIVE,
    });
    await category.save();
    reponseSuccess(res,categoryName)
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  const category = req.body.category;
  await Promise.all(
    categoryModel.findOneAndUpdate(
      { name: category },
      { status: statusMiddleWare.categoryStatus.DISABLE }
    ),
    productModel.updateMany(
      { category: category },
      { status: statusMiddleWare.categoryStatus.DISABLE }
    )
  )
    .then((value) => {
      reponseSuccess(res,category)
    })
    .catch((error) => {
      next(error);
    });
};
const getListCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.find({});
    let list = category.map((x) => x._id);
    if (list.length == 0) {
      throw new baseError(category,statusCode.BAD_REQUEST,errorList.FIND_ERROR);
    }
    reponseSuccess(res,category);
  } catch (error) {
    next(error);
  }
};
const getAllProduct = async (req, res) => {
  try {
    const category = req.body.category;
    const listProduct = await productModel.findMany({ category: category });
    if (listProduct.length == 0) {
      throw new baseError(categories,statusCode.BAD_REQUEST,errorList.FIND_ERROR);
    }
    reponseSuccess(res,listProduct);
  } catch (error) {
    next(error);
  }
};
const updateCategory = async (req, res,next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const opts = { session, new: true };
  try {
    const { name, newName } = req.body;
    await Promise.all(
      categoryModel.findOneAndUpdate({ name: name }, { name: newName },opts),
      productModel.updateMany({ category: name }, { category: newName },opts)
    );
    await session.commitTransaction();
    reponseSuccess(res,{ name: name, newName: newName });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
