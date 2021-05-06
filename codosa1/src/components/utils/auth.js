import user from "../users/user.model";
import staff from "../staffs/staff.model";
import manager from "../storeManager/manager.model";
import product from "../products/product.model";
import passport from "passport";
import passportMiddleware from "./passport";
import category from "../category/category.model";
import dotenv from "dotenv";
dotenv.config();
//import jwt from "jsonwebtoken";

const authen = (req, res, next) => {
  return passport.authenticate("jwt", { session: false })(req, res, next);
};

const isStaff = async (req, res, next) => {
  const role = req.user.role;
  if (role && role == "staff") {
    return next();
  } else {
    res.status(401).json({ message: "không có quyền staff" });
  }
};
const isUser = async (req, res, next) => {
  const role = req.user.role;
  if (role && role == "user") {
    next();
  } else {
    res.status(401).json({ Message: "Must be User" });
  }
};
const isManager = async (req, res, next) => {
  const role = req.user.role;
  if (role && role == "manager") {
    req.user = payload;
    return next();
  } else {
    res.status(401).json({ message: "không có quyền manager" });
  }
};

const checkUserExist = async (req, res, next) => {
  const { email, name, password } = req.body; //ok
  const users = await user.findOne({ email: email });
  if (users) {
    res.status(403).json({ message: "Đã tồn tại" });
  } else {
    next();
  }
};

const checkStaffExist = async (req, res, next) => {
  const email = req.body.email;
  const staffs = await staff.findOne({ email: email });
  if (staffs) {
    res.status(403).json({ message: "Đã tồn tại" });
  }
  next();
};
const checkManagerExist = async (req, res, next) => {
  const { email, name, password } = req.body;

  const managers = await manager.findOne({ email: email });

  if (managers) {
    res.status(403).json({ message: "Đã tồn tại" });
  }
  next();
};

const checkAuth = async (req, res, next) => {
  const role = req.user.role;
    if (role == "staff" || role == "manager") {
      next();
    } else {
      res.status(401).json({ message: "không có quyền " });
    }
  
};
const checkExitsProduct = async (req, res, next) => {
  const name = req.body.name;
  const products = await product.findOne({ name: name });
  if (products) {
    res.status(403).json({ message: "Đã tồn tại" });
  }
  next();
};
const checkExitsCategory = async (req, res, next) => {
  const name = req.body.category;
  const categories = await category.findOne({ name: name });
  if (categories) {
    res.status(403).json({ message: "Đã tồn tại" });
  }
  next();
};
const checkUpdateCart = async (req, res, next) => {
  const productName = req.body.productName;
  const amount = req.body.amount;
  try {
    const products = await product.findOne({ name: productName });

    if (!products) {
      res.status(400).json({ message: "Không tồn tại sản phẩm này" });
    }
    if (amount > products.amount) {
      res.status(400).json({ Message: "Số lượng vượt quá số lượng tồn kho" });
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

export default {
  isStaff,
  isManager,
  isUser,
  checkUserExist,
  checkStaffExist,
  checkManagerExist,
  checkAuth,
  checkExitsProduct,
  checkExitsCategory,
  checkUpdateCart,
  authen
};
