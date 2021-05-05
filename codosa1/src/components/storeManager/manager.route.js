import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import validates from "../utils/validate";
import managerController from "./manager.controller";
import managerValidate from "./manager.validate";
const managerRouter = Router();

managerRouter.post(
  "/register",
  // validate(validates.validateRegister, {}, {}),
  managerValidate.checkEmailNamePass,
  auth.checkManagerExist,
  managerController.managerRegister
);

managerRouter.post(
  "/login",
  // validate(validates.validateLogin, {}, {}),
  managerValidate.checkEmailPass,
  managerController.managerLogin
);

managerRouter.post(
  "/deleteuser",
  auth.isManager,
  // validate(validates.validateEmail, {}, {}),
  managerValidate.checkEmail,
  managerController.deleteUser
);

managerRouter.post(
  "/deletestaff",
  auth.isManager,
  // validate(validates.validateEmail, {}, {}),
  managerValidate.checkEmail,
  managerController.deleteStaff
);

managerRouter.post(
  "/updateuser",
  auth.isManager,
  // validate(validates.validateRegister, {}, {}),
  managerValidate.checkEmailNamePass,
  managerController.updateUser
);
managerRouter.post(
  "/updatestaff",
  auth.isManager,
  // validate(validates.validateRegister, {}, {}),
  managerValidate.checkEmailNamePass,
  managerController.updateStaff
);

managerRouter.get("/info", auth.isManager, managerController.getInfo);
managerRouter.post("/getuser", auth.isManager,managerValidate.checkEmail, managerController.getUser);
managerRouter.post("/getstaff", auth.isManager,managerValidate.checkEmail, managerController.getStaff);
export default managerRouter;
