import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import staffController from "./staff.controller";
import staffValidate from "./staff.validate";
import errorHandller from "../utils/errorHandller";
const staffRoute = Router();

staffRoute.post(
  "/register",
  validate(staffValidate.checkEmailNamePass),
  errorHandller(staffController.staffRegister)
);
staffRoute.post(
  "/login",
  validate(staffValidate.checkEmailPass),
  errorHandller(staffController.staffLogin)
);
staffRoute.put(
  "/update",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.checkEmailNamePass),
  errorHandller(staffController.updateUser)
);
staffRoute.delete(
  "/delete",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.checkEmail),
  errorHandller(staffController.deleteUser)
);
staffRoute.post(
  "/getuser",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.checkEmail),
  errorHandller(staffController.getUser)
);
staffRoute.get(
  "/info",
  auth.passportStaff,
  auth.isStaff,
  errorHandller(staffController.getInfo)
);
export default staffRoute;
