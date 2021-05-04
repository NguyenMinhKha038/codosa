import express from "express";
import multer from "multer";
import user from "../users/user.model";
import staff from "../staffs/staff.model";
import manager from "../storeManager/manager.model";
import product from "../products/product.model";
import category from "../category/category.model";

import jwt from "jsonwebtoken";

const addAvatar = async (req, res) => {
  const imgPath = "uploads/" + req.file.originalname;
  const email = req.body.email;
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const payload = await jwt.verify(token, process.env.privateKey);
    if (email && payload.role == "user") {
      try {
        await user.findOneAndUpdate({ email: email }, { image: imgPath });
        res.status(200).json({ Message: "Upload thành công" });
      } catch (error) {
        res.status(400).json({ Error: error });
      }
    }

    if (email && payload.role == "staff") {
      try {
        await staff.findOneAndUpdate({ email: email }, { image: imgPath });
        res.status(200).json({ Message: imgPath });
      } catch (error) {
        res.status(400).json({ Error: error });
      }
    }
    if (email && payload.role == "manager") {
      try {
        await manager.findOneAndUpdate({ email: email }, { image: imgPath });
        res.status(200).json({ Message: "Upload thành công" });
      } catch (error) {
        res.status(400).json({ Error: error });
      }
    }
  }
  res.status(400).json({ Message: "Cần đăng nhập" });
};
const addProductImage = async (req, res) => {
  const products = req.body.name;
  const categories = req.body.category;
  const img = req.files;
  const arrImage = img.map((x) => "uploads/" + x.originalname);
  try {
    await product.findOneAndUpdate({ name: products }, { image: arrImage });
    await category.findOneAndUpdate({ name: categories }, { image: arrImage });
    res.status(200).json({ Message: "Upload thành công" });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

export default { addAvatar, addProductImage };
