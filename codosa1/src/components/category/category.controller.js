import statusMiddleWare from "../utils/status";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import categoryService from "./category.service";
import productService from "../products/product.service";
const addCategory = async (req, res, next) => {
  try {
    const categoryName = req.body.category;
    const checkCategory = await categoryService.findByAny({
      name: categoryName,
    });
    if (checkCategory) {
      throw new BaseError({
        name: categoryName,
        httpCode: statusCode.ALREADY_EXITS,
        description: errorList.ALREADY_EXITS,
      });
    }
    let category = await categoryService.create({
      name: categoryName,
      status: statusMiddleWare.categoryStatus.ACTIVE,
    });
    responseSuccess(res, category);
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  const category = req.body.category;
  await Promise.all(
    categoryService.findOneAndUpdate(
      { name: category },
      { status: statusMiddleWare.categoryStatus.DISABLE }
    ),
    productService.findManyAndUpdate(
      { category: category },
      { status: statusMiddleWare.categoryStatus.DISABLE }
    )
  )
    .then((value) => {
      responseSuccess(res, category);
    })
    .catch((error) => {
      next(error);
    });
};
const getListCategory = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll();
    let list = categories.map((x) => x._id);
    if (list.length == 0) {
      throw new BaseError({
        name: categories,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, category);
  } catch (error) {
    next(error);
  }
};
const getAllProduct = async (req, res, next) => {
  try {
    const category = req.body.category;
    const listProduct = await categoryService.findByAny(
      { name: category },
      "product"
    );
    if (listProduct.length == 0) {
      throw new BaseError({
        name: category,
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
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const option = { session, new: true };
  try {
    const { name, newName } = req.body;
    await Promise.all(
      categoryService.findOneAndUpdate(
        { name: name },
        { name: newName },
        option
      ),
      productService.findManyAndUpdate(
        { category: name },
        { category: newName },
        option
      )
    );
    await session.commitTransaction();
    responseSuccess(res, { name, newName });
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
