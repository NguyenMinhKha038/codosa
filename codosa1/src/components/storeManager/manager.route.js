import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import managerController from "./manager.controller";
import managerValidate from "./manager.validate";
import errorHandller from "../utils/errorHandller";
const managerRouter = Router();

managerRouter.post(
  "/register",
  validate(managerValidate.checkEmailNamePass),
  managerController.managerRegister
);

managerRouter.post(
  "/login",
  validate(managerValidate.checkEmailPass),
  managerController.managerLogin
);

managerRouter.delete(
  "/deleteuser",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.checkEmail),
  managerController.deleteUser
);

managerRouter.delete(
  "/deletestaff",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.checkEmail),
  managerController.deleteStaff
);

managerRouter.put(
  "/updateuser",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.checkEmailNamePass),
  managerController.updateUser
);
managerRouter.put(
  "/updatestaff",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.checkEmailNamePass),
  managerController.updateStaff
);

managerRouter.get(
  "/info",
  auth.passportManager,
  auth.isManager,
  managerController.getInfo
);
managerRouter.post(
  "/getuser",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.checkEmail),
  managerController.getUser
);
managerRouter.post(
  "/getstaff",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.checkEmail),
  managerController.getStaff
);
export default managerRouter;
