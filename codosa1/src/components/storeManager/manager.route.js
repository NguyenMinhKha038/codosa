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

managerRouter.delete(
  "/delete-user",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.Email),
  managerController.deleteUser
);

managerRouter.delete(
  "/delete-staff",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.Email),
  managerController.deleteStaff
);

managerRouter.put(
  "/update-user",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.EmailNamePass),
  managerController.updateUser
);
managerRouter.put(
  "/update-staff",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.EmailNamePass),
  managerController.updateStaff
);

managerRouter.get(
  "/info",
  auth.passportManager,
  auth.isManager,
  managerController.getInfo
);
managerRouter.get(
  "/get-user",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.Email),
  managerController.getUser
);
managerRouter.get(
  "/get-staff",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.Email),
  managerController.getStaff
);

export default managerRouter;
