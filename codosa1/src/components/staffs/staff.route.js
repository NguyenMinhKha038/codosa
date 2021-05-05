import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
//import validates from "../utils/validate";
import staffController from "./staff.controller";
import staffValidate from "./staff.validate"
const staffRoute = Router();

staffRoute.post(
  "/register",
  // validate(validates.validateRegister, {}, {}),
  staffValidate.checkEmailNamePass,
  auth.checkStaffExist,
  staffController.staffRegister
);
staffRoute.post(
  "/login",
  // validate(validates.validateLogin, {}, {}),
  staffValidate.checkEmailPass,
  staffController.staffLogin
);
staffRoute.post(
  "/update",
  auth.isStaff,
  // validate(validates.validateRegister, {}, {}),
  staffValidate.checkEmailNamePass,
  staffController.updateUser
);
staffRoute.post(
  "/delete",
  auth.isStaff,
  // validate(validates.validateEmail, {}, {}),
  staffValidate.checkEmail,
  staffController.deleteUser
);
staffRoute.post(
  "/getuser",
  auth.isStaff,
  // validate(validates.validateEmail, {}, {}),,
  staffValidate.checkEmail,
  staffController.getUser
);
staffRoute.get("/info", auth.isStaff, staffController.getInfo);
export default staffRoute;
