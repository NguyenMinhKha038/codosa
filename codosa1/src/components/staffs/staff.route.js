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
staffRoute.get("/me", staffController.getInfo);
staffRoute.put(
  "/user/:id",
  staffValidate.validateId,
  validate(staffValidate.EmailNamePass),
  staffController.updateUser
);
staffRoute.delete(
  "/user/:id",
  staffValidate.validateId,
  staffController.deleteUser
);
staffRoute.get(
  "/user/:id",
  staffValidate.validateId,
  staffController.getUser
);

export default staffRoute;
