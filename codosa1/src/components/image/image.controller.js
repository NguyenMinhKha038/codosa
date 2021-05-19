import express from "express";
import multer from "multer";
import user from "../users/user.model";
import staff from "../staffs/staff.model";
import manager from "../storeManager/manager.model";
import product from "../products/product.model";
import category from "../category/category.model";
const addAvatar = async (req, res, next) => {
  try {
    const imgPath = "uploads/" + req.file.originalname;
    const email = req.user.email;
    const role = req.user.role;
    if (email && role == 0) {
      await user.findOneAndUpdate({ email: email }, { image: imgPath });
      return res.status(200).json({ Message: imgPath });
    }
    if (email && role == 1) {
      await staff.findOneAndUpdate({ email: email }, { image: imgPath });
      return res.status(200).json({ Message: imgPath });
    }
    if (email && role == 2) {
      await manager.findOneAndUpdate({ email: email }, { image: imgPath });
      return res.status(200).json({ Message: "Upload thành công" });
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
    const products = req.body.name;
    const categories = req.body.category;
    const img = req.files;
    const arrImage = img.map((x) => "uploads/" + x.originalname);
    await Promise.all(
      product.findOneAndUpdate({ name: products }, { image: arrImage },option),
      category.findOneAndUpdate({ name: categories }, { image: arrImage },option)
    );
    await session.commitTransaction();
    return res.status(200).json({ Message: "Upload thành công" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export default { addAvatar, addProductImage };
