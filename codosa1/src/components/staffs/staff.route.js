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
staffRoute.use(auth.passport, auth.isStaff);
staffRoute.put(
  "/user",
  validate(staffValidate.EmailNamePass),
  staffController.updateUser
);
staffRoute.delete(
  "/user",
  validate(staffValidate.Email),
  staffController.deleteUser
);
staffRoute.get(
  "/user",
  validate(staffValidate.Email),
  staffController.getUser
);
staffRoute.get("/info", staffController.getInfo);
export default staffRoute;
