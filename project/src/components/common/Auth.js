import check from "express-validator";
import user from "../users/user.model";

const isAdmin = async (req, res, next) => {
  await passport.authenticate("jwt", { session: false });
  if (req.user.role == "admin") {
    next();
  } else {
    res.status(401).json({ message: "không có quyền admin" });
  }
};
const isUser = async (req, res, next) => {
  await passport.authenticate("jwt", { session: false });
  if (req.user.role == "user") {
    next();
  } else {
    res.status(401).json({ message: "không có quyền user" });
  }
};
const Validate = () => {
  return [
    check("user.email", "Invalid does not Empty").not().isEmpty(),
    check("user.email", "Invalid email").isEmail(),
    check("user.password", "Invalid does not Empty").not().isEmpty(),
    check("user.name", "Invalid does not Empty").not().isEmpty(),
  ];
};

const CheckExist = async (req, res, next) => {
  const { name, password, role } = req.body;
  if (await user.findOne({ name: name, role: role })) {
    res.status(403).json({ message: "Đã tồn tại" });
  }
};

export default {
  isAdmin,
  isUser,
  Validate,
  CheckExist,
};
