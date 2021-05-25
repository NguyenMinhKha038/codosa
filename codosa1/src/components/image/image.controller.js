import { userService } from "../users/user.service";
import { staffService } from "../staffs/staff.service";
import { managerService } from "../storeManager/manager.service";
import { productService } from "../products/product.service";
import { categoryService } from "../category/category.service";
import mongoose from "mongoose";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
const addAvatar = async (req, res, next) => {
  try {
    const imgPath = "uploads/" + req.file.originalname;
    const service = [userService, staffService, managerService];
    const { email, role } = req.user;
    await service[role].findOneAndUpdate({ email: email }, { image: imgPath });
    responseSuccess(res, imgPath);
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
    const productfind = await productService.findOneByAny({ _id: productId });
    if (!productfind) {
      throw new BaseError({
        name: productId,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    await Promise.all([
      productService.findOneAndUpdate(
        { _id: productId },
        { image: arrImage },
        option
      ),
      categoryService.findOneAndUpdate(
        { name: category },
        { image: arrImage },
        option
      ),
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
