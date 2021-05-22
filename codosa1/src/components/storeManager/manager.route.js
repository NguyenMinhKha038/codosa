import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import managerController from "./manager.controller";
import managerValidate from "./manager.validate";
const managerRouter = Router();

managerRouter.post(
  "/register",
  validate(managerValidate.EmailNamePass),
  managerController.managerRegister
);

managerRouter.post(
  "/login",
  validate(managerValidate.EmailPass),
  managerController.managerLogin
);
managerRouter.use(auth.passport, auth.isManager);
managerRouter.delete(
  "/user",
  validate(managerValidate.Email),
  managerController.deleteUser
);

managerRouter.delete(
  "/staff",
  validate(managerValidate.Email),
  managerController.deleteStaff
);

managerRouter.put(
  "/user",
  validate(managerValidate.EmailNamePass),
  managerController.updateUser
);
managerRouter.put(
  "/staff",
  validate(managerValidate.EmailNamePass),
  managerController.updateStaff
);

managerRouter.get(
  "/info",
  managerController.getInfo
);
managerRouter.get(
  "/user",
  validate(managerValidate.Email),
  managerController.getUser
);
managerRouter.get(
  "/staff",
  validate(managerValidate.Email),
  managerController.getStaff
);

export default managerRouter;
