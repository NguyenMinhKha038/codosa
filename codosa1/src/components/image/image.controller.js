import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import userModel from "../users/user.model";
import staffModel from "../staffs/staff.model";
import managerModel from "../storeManager/manager.model";
import productModel from "../products/product.model";
import categoryModel from "../category/category.model";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
const addAvatar = async (req, res, next) => {
  try {
    const imgPath = "uploads/" + req.file.originalname;
    const { email, role } = req.user;
    if (role == 0) {
      await userModel.findOneAndUpdate({ email: email }, { image: imgPath });
      responseSuccess(res, imgPath);
    }
    if (role == 1) {
      await staffModel.findOneAndUpdate({ email: email }, { image: imgPath });
      responseSuccess(res, imgPath);
    }
    if (role == 2) {
      await managerModel.findOneAndUpdate({ email: email }, { image: imgPath });
      responseSuccess(res, imgPath);
    }
  } catch (error) {
    next(error);
  }
};
const addProductImage = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //start transaction
  const option = { session, new: true };
  try {
    const productId = req.body._id;
    const category = req.body.category;
    const img = req.files;
    const arrImage = img.map((x) => "uploads/" + x.originalname);
    const productfind = await productModel.findOne({ _id: productId });
    if(!productfind){
      throw new BaseError({name:productId,httpCode:statusCode.NOT_FOUND,description:errorList.FIND_ERROR})
    }
    await Promise.all([
      productModel.findOneAndUpdate(
        { _id: productId },
        { image: arrImage },
        option
      ),
      categoryModel.findOneAndUpdate(
        { name: category },
        { image: arrImage },
        option
      )
      ]);
    await session.commitTransaction();
    responseSuccess(res, arrImage);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export default { addAvatar, addProductImage };
