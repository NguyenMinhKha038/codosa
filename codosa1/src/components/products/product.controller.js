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
    if (!category) {
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
    const {page,perPage}= req.query;
    const product = await productService.get(null,null,{limit: Number(perPage), skip: page > 0 ? (page - 1) * perPage : 0});
    if (!product.length) {
      throw new BaseError({
        name: status,
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
    const { quantity, price, newName, description ,categoryId} = req.body;
    const productId = req.params.productId;
    const [existedProduct,existedNewName,existedCategory] = await Promise.all([
      productService.getOne({ _id: productId }),
      productService.getOne({name:newName}),
      categoryService.getOne({_id:categoryId})
    ]);
    if (!existedProduct) {
      throw new BaseError({
        name: productId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    if(existedNewName){
      throw new BaseError({
        name: productId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.ALREADY_EXITS,
      });
    }
    if(!existedCategory){
      throw new BaseError({
        name: categoryId,
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
        categoryId
      }
    );
    responseSuccess(res, 200, updatedProduct);
  } catch (error) {
    next(error);
  }
};


export default {
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct
};
