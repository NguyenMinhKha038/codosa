import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../common/auth";
import validates from "../common/validate";
import staffController from "./staff.controller";
const staffRoute = Router();

staffRoute.post(
  "/register",
  validate(validates.validateRegister, {}, {}),
  auth.checkStaffExist,
  staffController.staffRegister
);
staffRoute.post(
  "/login",
  validate(validates.validateLogin, {}, {}),
  staffController.staffLogin
);
staffRoute.post(
  "/update",
  auth.isStaff,
  validate(validates.validateRegister, {}, {}),
  staffController.updateUser
);
staffRoute.post(
  "/delete",
  auth.isStaff,
  validate(validates.validateEmail, {}, {}),
  staffController.deleteUser
);
staffRoute.post(
  "/getuser",
  auth.isStaff,
  validate(validates.validateEmail, {}, {}),
  staffController.getUser
);
staffRoute.get("/info", auth.isStaff, staffController.getInfo);
export default staffRoute;
