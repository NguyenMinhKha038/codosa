import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import validates from "../utils/validate";
import managerController from "./manager.controller";
import managerValidate from "./manager.validate";
const managerRouter = Router();

managerRouter.post(
  "/register",
  validate(managerValidate.checkEmailNamePass, {}, {}),
  auth.checkManagerExist,
  managerController.managerRegister
);

managerRouter.post(
  "/login",
  validate(managerValidate.checkEmailPass, {}, {}),
  //managerValidate.checkEmailPass,
  managerController.managerLogin
);

managerRouter.post(
  "/deleteuser",
  auth.authen,
  auth.isManager,
  validate(managerValidate.checkEmail, {}, {}),
  //managerValidate.checkEmail,
  managerController.deleteUser
);

managerRouter.post(
  "/deletestaff",
  auth.authen,
  auth.isManager,
  validate(managerValidate.checkEmail, {}, {}),
  //managerValidate.checkEmail,
  managerController.deleteStaff
);

managerRouter.post(
  "/updateuser",
  auth.authen,
  auth.isManager,
  validate(managerValidate.checkEmailNamePass, {}, {}),
  //managerValidate.checkEmailNamePass,
  managerController.updateUser
);
managerRouter.post(
  "/updatestaff",
  auth.authen,
  auth.isManager,
  validate(managerValidate.checkEmailNamePass, {}, {}),
  //managerValidate.checkEmailNamePass,
  managerController.updateStaff
);

managerRouter.get("/info", auth.isManager, managerController.getInfo);
managerRouter.post("/getuser",auth.authen, auth.isManager,validate(managerValidate.checkEmail, {}, {}), managerController.getUser);
managerRouter.post("/getstaff", auth.authen,auth.isManager,validate(managerValidate.checkEmail, {}, {}), managerController.getStaff);
export default managerRouter;
