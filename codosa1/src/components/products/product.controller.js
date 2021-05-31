import statusMiddleWare from "../utils/status";
import mongoose from "mongoose";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { productService } from "./product.service";
import { categoryService } from "../category/category.service";
const addProduct = async (req, res, next) => {
  try {
    const { name, quantity, price, categoryId, description } = req.body;
    await Promise.all([
      productService.getOne({
        condition: { name: name },
      }),
      categoryService.getOne({
        condition: { _id: categoryId },
      }),
    ])
      .then((value) => {
        if (value[0] !== null) {
          throw new BaseError({
            name: name,
            httpCode: statusCode.ALREADY_EXITS,
            description: errorList.ALREADY_EXITS,
          });
        } else if (value[1] === null) {
          throw new BaseError({
            name: categoryId,
            httpCode: statusCode.BAD_REQUEST,
            description: errorList.CATEGORY_ID_NOT_FOUND,
          });
        }
      })
      .catch((error) => {
        next(error);
      });
    let newProduct = await productService.create({
      name,
      quantity,
      price,
      categoryId,
      description,
    });
    responseSuccess(res, newProduct);
  } catch (error) {
    next(error);
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
  try {
    const producId = req.params.id;
    const productExits = await productService.getOne({
      condition: { _id: producId },
    });
    if (!productExits) {
      throw new BaseError({
        name: producId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    const product = await productService.findOneAndDelete({ _id: producId });
    responseSuccess(res, product);
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (req, res, next) => {
  try {
    const { quantity, price, newName, description } = req.body;
    const productId = req.params.id;
    const productExits = await productService.getOne({
      condition: { _id: productId },
    });
    if (!productExits) {
      throw new BaseError({
        name: productId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    await productService.findOneAndUpdate(
      { _id: productId },
      {
        name: newName,
        quantity: quantity,
        price: price,
        description: description,
      }
    );
    responseSuccess(res, {
      newName: newName,
      quantity: quantity,
      price: price,
    });
  } catch (error) {
    next(error);
  }
};

export default { addProduct, getProduct, deleteProduct, updateProduct };
