import express from "express";
import multer from "multer";
import user from "../users/user.model";
import staff from "../staffs/staff.model";
import manager from "../storeManager/manager.model";
import product from "../products/product.model";
import category from "../category/category.model";

import jwt from "jsonwebtoken";

const addAvatar = async (req, res, next) => {
  const imgPath = "uploads/" + req.file.originalname;
  const email = req.user.email;
  const role = req.user.role;
  if (email && role == "user") {
    try {
      await user.findOneAndUpdate({ email: email }, { image: imgPath });
      res.status(200).json({ Message: imgPath });
    } catch (error) {
      next(error);
    }
  }

  if (email && role == "staff") {
    try {
      await staff.findOneAndUpdate({ email: email }, { image: imgPath });
      res.status(200).json({ Message: imgPath });
    } catch (error) {
      next(error);
    }
  }
  if (email && role == "manager") {
    try {
      await manager.findOneAndUpdate({ email: email }, { image: imgPath });
      res.status(200).json({ Message: "Upload thành công" });
    } catch (error) {
      next(error);
    }
  }
};
const addProductImage = async (req, res, next) => {
  const products = req.body.name;
  const categories = req.body.category;
  const img = req.files;
  const arrImage = img.map((x) => "uploads/" + x.originalname);
  try {
    await Promise.all(
      product.findOneAndUpdate({ name: products }, { image: arrImage }),
      category.findOneAndUpdate({ name: categories }, { image: arrImage })
    );
    res.status(200).json({ Message: "Upload thành công" });
  } catch (error) {
    next(error);
  }
};

export default { addAvatar, addProductImage };
