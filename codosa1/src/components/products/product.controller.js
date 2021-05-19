import categoryModel from "../category/category.model";
import product from "../products/product.model";
import statusMiddleWare from "../utils/status";
import mongoose from "mongoose";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {baseRes} from "../error/baseRes";
const addProduct = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction(); //start transaction
    const opts = { session, new: true };
    const { name, amount, price, category, description } = req.body;
    const checkProduct = await product.findOne({ name: name }, opts);
    if (checkProduct) {
      return res.status(403).json({ message: "Already exist " });
    }
    let products = new product({
      name,
      amount,
      price,
      category,
      description,
      status: statusMiddleWare.productStatus.ACTIVE,
    });
    const checkCategory = await categoryModel.find({ name: category }, opts);
    if (!checkCategory) {
      let categories = new categoryModel({
        name: category,
        status: statusMiddleWare.categoryStatus.ACTIVE,
      });
      await categories.save(opts);
    }
    await products.save(opts);
    await session.commitTransaction();
    // return res.status(200).json({
    //   message: {
    //     name,
    //     amount,
    //     price,
    //     description,
    //   },
    // });
    baseRes(res,statusCode.Created,orders,"Successful")
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const products = await product.find({ name: name });
    if (products) {
      // return res.status(200).json({
      //   name: products[0].name,
      //   amount: products[0].amount,
      //   price: products[0].price,
      // });
      baseRes(res,statusCode.Created,products,"Successful")
    }
    throw new baseError(name,statusCode.NOT_FOUND,errorList.foundError);
  } catch (error) {
    next(errer);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const checkExits = await product.findOne({ name: name });
    if (!checkExits) {
      throw new baseError(name,statusCode.NOT_FOUND,errorList.foundError);
    }
    await product.findOneAndUpdate(
      { name: name },
      { status: statusMiddleWare.productStatus.DISABLE }
    );
    baseRes(res,statusCode.Created,null,"Successful")
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const opts = { session, new: true };
  try {
    const { name, amount, price, newName, productId } = req.body;
    const checkExits = await product.findOne({ _id: productId },opts);
    if (!checkExits) {
      throw new baseError(name,statusCode.NOT_FOUND,errorList.foundError);
    }
    await product.findOneAndUpdate(
      { _id: productId },
      { name: newName, amount: amount, price: price },
      opts
    );
    await session.commitTransaction();
    // return res
    //   .status(200)
    //   .json({ message: { name: newName, amount: amount, price: price } });
    baseRes(res,statusCode.Created,{ name: newName, amount: amount, price: price},"Successful")
  } catch (error) {
    next(error);
  }
};

export default { addProduct, getProduct, deleteProduct, updateProduct };
