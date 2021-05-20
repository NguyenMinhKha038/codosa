import statusMiddleWare from "../utils/status";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { reponseSuccess } from "../error/baseResponese";
import categoryService from "./category.service";
import productService from "../products/product.service";
const addCategory = async (req, res, next) => {
  try {
    const categoryName = req.body.category;
    const checkCategory = await categoryService.findByAny({
      name: categoryName,
    });
    if (checkCategory) {
      throw new baseError(
        categoryName,
        statusCode.ALREADY_EXITS,
        errorList.ALREADY_EXITS
      );
    }
    let category = await categoryService.create({
      name: categoryName,
      status: statusMiddleWare.categoryStatus.ACTIVE,
    });
    reponseSuccess(res, category);
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
      reponseSuccess(res, category);
    })
    .catch((error) => {
      next(error);
    });
};
const getListCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getAll();
    let list = category.map((x) => x._id);
    if (list.length == 0) {
      throw new baseError(
        category,
        statusCode.BAD_REQUEST,
        errorList.FIND_ERROR
      );
    }
    reponseSuccess(res, category);
  } catch (error) {
    next(error);
  }
};
const getAllProduct = async (req, res) => {
  try {
    const category = req.body.category;
    const listProduct = await productService.findMany({ category: category });
    if (listProduct.length == 0) {
      throw new baseError(
        categories,
        statusCode.BAD_REQUEST,
        errorList.FIND_ERROR
      );
    }
    reponseSuccess(res, listProduct);
  } catch (error) {
    next(error);
  }
};
const updateCategory = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const opts = { session, new: true };
  try {
    const { name, newName } = req.body;
    await Promise.all(
      categoryService.findOneAndUpdate({ name: name }, { name: newName }, opts),
      productService.findManyAndUpdate(
        { category: name },
        { category: newName },
        opts
      )
    );
    await session.commitTransaction();
    reponseSuccess(res, { name: name, newName: newName });
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
