import user from "../users/user.model";
import staff from "../staffs/staff.model";
import manager from "../storeManager/manager.model";
import product from "../products/product.model";
import category from "../category/category.model";
import { validate, ValidationError, Joi } from "express-validation";
import passport from "../common/passport";
import jwt from "jsonwebtoken";

const isStaff = async (req, res, next) => {
  await passport.authenticate("jwt", { session: false });
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  if (payload && payload.role == "staff") {
    return next();
  } else {
    res.status(401).json({ message: "không có quyền staff" });
  }
};
const isUser = async (req, res, next) => {
  await passport.authenticate("jwt", { session: false });
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);

  if (payload && payload.role == "user") {
    req.user = payload;
    next();
  } else {
    // Nếu token tồn tại nhưng không hợp lệ, server sẽ response status code 401 với msg bên dưới
    res.status(401).json({ message: "Không có quyền user" });
  }
};
const isManager = async (req, res, next) => {
  await passport.authenticate("jwt", { session: false });
  const token = req.headers.authorization.split(" ")[1];
  const payload = await jwt.verify(token, process.env.privateKey);
  if (payload && payload.role == "manager") {
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
  await passport.authenticate("jwt", { session: false });
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const payload = await jwt.verify(token, process.env.privateKey);
    if (payload.role == "staff" || payload.role == "manager") {
      next();
    } else {
      res.status(401).json({ message: "không có quyền " });
    }
  } else {
    res.status(400).json({ message: "Cần đăng nhập " });
  }
};
const checkExitsProduct = async (req, res,next) => {
  const name = req.body.name;
  const products = await product.findOne({ name: name });
  if (products) {
    res.status(403).json({ message: "Đã tồn tại" });
  }
  next();
};
const checkExitsCategory=async(req,res,next)=>{
  const name = req.body.category;
  const categorys =await category.findOne({name:name});
  if(categorys){
    res.status(403).json({message:"Đã tồn tại"});
  }
  next();
}
const checkUpdateCart=async(req,res,next)=>{
  const productName=req.body.productName;
  try {
    const products = await product.findOne({name:productName});
    if(products){
      next();
    }
    res.status(400).json({message:"Không tồn tại sản phẩm này"});
  } catch (error) {
    res.status(400).json({Error:error});
  }
}
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
  checkUpdateCart
};
