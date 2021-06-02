import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import staffController from "./staff.controller";
import staffValidate from "./staff.validate";
import permission from "../utils/permission"
import baseValidate from "../utils/validate"
const staffRoute = Router();
staffRoute.post(
  "/register",
  validate(baseValidate.validateRegister),
  staffController.staffRegister
);
staffRoute.post(
  "/login",
  validate(baseValidate.validateLogin),
  staffController.staffLogin
);
staffRoute.use(auth.passport, auth.authenticate([permission.STAFF]));
staffRoute.get("/me", staffController.getInfo);
staffRoute.put(
  "/user/:id",
  baseValidate.validateId,
  validate(staffValidate.EmailNamePass),
  staffController.updateUser
);
staffRoute.delete(
  "/user/:id",
  baseValidate.validateId,
  staffController.deleteUser
);
staffRoute.get(
  "/user/:id",
  baseValidate.validateId,
  staffController.getUser
);

export default staffRoute;
