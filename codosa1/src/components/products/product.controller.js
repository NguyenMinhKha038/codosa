import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { productService } from "./product.service";
import { categoryService } from "../category/category.service";
const addProduct = async (req, res, next) => {
  try {
    const { name, quantity, price, description, categoryId } = req.body;
    const [product, category] = await Promise.all([
      productService.getOne({ name, categoryId }),
      categoryService.getOne({ _id: categoryId }),
    ]);
    if (product) {
      throw new BaseError({
        name: name,
        httpCode: statusCode.ALREADY_EXITS,
        description: errorList.ALREADY_EXITS,
      });
    }
    if (category === null) {
      throw new BaseError({
        name: categoryId,
        httpCode: statusCode.BAD_REQUEST,
        description: errorList.CATEGORY_ID_NOT_FOUND,
      });
    }
    const newProduct = await productService.create({
      name,
      quantity,
      price,
      categoryId,
      description,
    });
    responseSuccess(res, 201, newProduct);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await productService.getOne({ _id: productId });
    if (!product) {
      throw new BaseError({
        name: productId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, 200, product);
  } catch (error) {
    next(error);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const producId = req.params.id;
    const product = await productService.getOne({ _id: producId });
    if (!product) {
      throw new BaseError({
        name: producId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    const disabledProduct = await productService.findOneAndDisable({
      _id: producId,
    });
    responseSuccess(res, 204, disabledProduct);
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (req, res, next) => {
  try {
    const { quantity, price, newName, description } = req.body;
    const productId = req.params.productId;
    const existedProduct = await productService.getOne({ _id: productId });
    if (!existedProduct) {
      throw new BaseError({
        name: productId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    const updatedProduct = await productService.findOneAndUpdate(
      { _id: productId },
      {
        name: newName,
        quantity: quantity,
        price: price,
        description: description,
      }
    );
    responseSuccess(res, 200, updatedProduct);
  } catch (error) {
    next(error);
  }
};
const getAllByCategory = async (req, res, next) => {
  try {
    const categoryId = req.body.categoryId;
    const products = await productService.get(
      { categoryId: categoryId },
      null,
      { populate: "category" }
    );
    responseSuccess(res, 200, products);
  } catch (error) {
    next(error);
  }
};

export default {
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getAllByCategory,
};
