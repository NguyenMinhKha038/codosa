import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import staffController from "./staff.controller";
import staffValidate from "./staff.validate";
import permission from "../utils/permission"
import baseValidate from "../utils/validate"
const staffRoute = Router();
const managerRouter=Router();
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

managerRouter.use(auth.passport, auth.authenticate([permission.MANAGER]))
managerRouter.delete(
  "/:id",
  baseValidate.validateId,
  staffController.managerDeleteStaff
);
managerRouter.put(
  "/:id",
  baseValidate.validateId,
  validate(baseValidate.validateEmailNamePass),
  staffController.managerUpdateStaff
);
managerRouter.get(
  "/:id",
  baseValidate.validateId,
  staffController.managerGetStaff
);
staffRoute.use("/manager",managerRouter)
export default staffRoute;
