import user from "../users/user.model";
import staff from "../staffs/staff.model";
import manager from "../storeManager/manager.model";
import product from "../products/product.model";
import passport from "passport";
import { users, staffs, managers } from "./passport";
import category from "../category/category.model";

const passportUser = (req, res, next) => {
  return passport.authenticate("user", { session: false })(req, res, next);
};

const passportStaff = (req, res, next) => {
  return passport.authenticate("staff", { session: false })(req, res, next);
};
const passportManager = (req, res, next) => {
  return passport.authenticate("manager", { session: false })(req, res, next);
};
const isStaff = async (req, res, next) => {
  const role = req.user.role;
  if (role && role == 1) {
    return next();
  } else {
    res.status(401).json({ message: "Must be Staff" });
  }
};
const isUser = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role && role == 0) {
      next();
    } else {
      res.status(401).json({ Message: "Must be User" });
    }
  } catch (error) {
    next(error);
  }
};
const isManager = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role && role == 2) {
      return next();
    } else {
      res.status(401).json({ message: req.user });
    }
  } catch (error) {
    next(error);
  }
};

const checkUserExist = async (req, res, next) => {
  try {
    const { email, name, password } = req.body; //ok
    const users = await user.findOne({ email: email });
    if (users) {
      res.status(403).json({ message: "Đã tồn tại" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkStaffExist = async (req, res, next) => {
  try {
    const email = req.body.email;
    const staffs = await staff.findOne({ email: email });
    if (staffs) {
      res.status(403).json({ message: "Đã tồn tại" });
    }
    next();
  } catch (error) {
    next(error);
  }
};
const checkManagerExist = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const managers = await manager.findOne({ email: email });

    if (managers) {
      res.status(403).json({ message: "Đã tồn tại" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const checkAuth = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role == 1 || role == 2) {
      next();
    } else {
      res.status(401).json({ message: req.user });
    }
  } catch (error) {
    next(error);
  }
};
const checkExitsProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const products = await product.findOne({ name: name });
    if (products) {
      res.status(403).json({ message: "Đã tồn tại" });
    }
    next();
  } catch (error) {
    next(error);
  }
};
const checkExitsCategory = async (req, res, next) => {
  try {
    const name = req.body.category;
    const categories = await category.findOne({ name: name });
    if (categories) {
      res.status(403).json({ message: "Đã tồn tại" });
    }
    next();
  } catch (error) {
    next(error);
  }
};
const checkUpdateCart = async (req, res, next) => {
  try {
    const productName = req.body.productName;
    const amount = req.body.amount;
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
  passportUser,
  passportStaff,
  passportManager,
};
