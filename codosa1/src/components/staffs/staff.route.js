import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import staffController from "./staff.controller";
import staffValidate from "./staff.validate";
const staffRoute = Router();

staffRoute.post(
  "/register",
  validate(staffValidate.checkEmailNamePass),
  staffController.staffRegister
);
staffRoute.post(
  "/login",
  validate(staffValidate.checkEmailPass),
  staffController.staffLogin
);
staffRoute.put(
  "/updateuser",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.checkEmailNamePass),
  staffController.updateUser
);
staffRoute.delete(
  "/deleteuser",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.checkEmail),
  staffController.deleteUser
);
staffRoute.post(
  "/getuser",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.checkEmail),
  staffController.getUser
);
staffRoute.get(
  "/info",
  auth.passportStaff,
  auth.isStaff,
  staffController.getInfo
);
export default staffRoute;
