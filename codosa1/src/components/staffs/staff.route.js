import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
//import validates from "../utils/validate";
import staffController from "./staff.controller";
import staffValidate from "./staff.validate"
const staffRoute = Router();

staffRoute.post(
  "/register",
  validate(staffValidate.checkEmailNamePass, {}, {}),
  //staffValidate.checkEmailNamePass,
  auth.checkStaffExist,
  staffController.staffRegister
);
staffRoute.post(
  "/login",
  validate(staffValidate.checkEmailPass, {}, {}),
  //staffValidate.checkEmailPass,
  staffController.staffLogin
);
staffRoute.post(
  "/update",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.checkEmailNamePass, {}, {}),
  //staffValidate.checkEmailNamePass,
  staffController.updateUser
);
staffRoute.post(
  "/delete",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.checkEmail, {}, {}),
  //staffValidate.checkEmail,
  staffController.deleteUser
);
staffRoute.post(
  "/getuser",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.checkEmail, {}, {}),
  //staffValidate.checkEmail,
  staffController.getUser
);
staffRoute.get("/info",auth.passportStaff, auth.isStaff, staffController.getInfo);
export default staffRoute;
