import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import staffController from "./staff.controller";
import staffValidate from "./staff.validate";
import permission from "../utils/permission"
import baseValidate from "../utils/validate"
const staffRoute = Router();
const managerRouter=Router();
const mainRouter =Router();
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
  validate(baseValidate.validateId),
  staffController.managerDeleteStaff
);
managerRouter.put(
  "/:id",
  validate(baseValidate.validateId),
  validate(baseValidate.validateEmailNamePass),
  staffController.managerUpdateStaff
);
managerRouter.get(
  "/",
  validate(staffValidate.validateManagerGet),
  staffController.managerGetStaff
);
mainRouter.use("/manager",managerRouter)
mainRouter.use(staffRoute)
export default mainRouter;
