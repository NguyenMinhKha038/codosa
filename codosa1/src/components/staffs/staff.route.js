import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import staffController from "./staff.controller";
import staffValidate from "./staff.validate";
const staffRoute = Router();

staffRoute.post(
  "/register",
  validate(staffValidate.EmailNamePass),
  staffController.staffRegister
);
staffRoute.post(
  "/login",
  validate(staffValidate.EmailPass),
  staffController.staffLogin
);
staffRoute.put(
  "/update-user",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.EmailNamePass),
  staffController.updateUser
);
staffRoute.delete(
  "/delete-user",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.Email),
  staffController.deleteUser
);
staffRoute.get(
  "/get-user",
  auth.passportStaff,
  auth.isStaff,
  validate(staffValidate.Email),
  staffController.getUser
);
staffRoute.get(
  "/info",
  auth.passportStaff,
  auth.isStaff,
  staffController.getInfo
);
export default staffRoute;
