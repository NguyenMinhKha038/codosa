import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import validates from "../utils/validate";
import managerController from "./manager.controller";
import managerValidate from "./manager.validate";
import errorHandller from "../utils/errorHandller";
const managerRouter = Router();

managerRouter.post(
  "/register",
  validate(managerValidate.checkEmailNamePass, {}, {}),
  auth.checkManagerExist,
  errorHandller(managerController.managerRegister)
);

managerRouter.post(
  "/login",
  validate(managerValidate.checkEmailPass, {}, {}),
  //managerValidate.checkEmailPass,
  errorHandller(managerController.managerLogin)
);

managerRouter.post(
  "/deleteuser",
  auth.authen,
  auth.isManager,
  validate(managerValidate.checkEmail, {}, {}),
  //managerValidate.checkEmail,
  errorHandller(managerController.deleteUser)
);

managerRouter.post(
  "/deletestaff",
  auth.authen,
  auth.isManager,
  validate(managerValidate.checkEmail, {}, {}),
  //managerValidate.checkEmail,
  errorHandller(managerController.deleteStaff)
);

managerRouter.post(
  "/updateuser",
  auth.authen,
  auth.isManager,
  validate(managerValidate.checkEmailNamePass, {}, {}),
  //managerValidate.checkEmailNamePass,
  errorHandller(managerController.updateUser)
);
managerRouter.post(
  "/updatestaff",
  auth.authen,
  auth.isManager,
  validate(managerValidate.checkEmailNamePass, {}, {}),
  //managerValidate.checkEmailNamePass,
  errorHandller(managerController.updateStaff)
);

managerRouter.get("/info", auth.isManager, managerController.getInfo);
managerRouter.post("/getuser",auth.authen, auth.isManager,validate(managerValidate.checkEmail, {}, {}), managerController.getUser);
managerRouter.post("/getstaff", auth.authen,auth.isManager,validate(managerValidate.checkEmail, {}, {}), managerController.getStaff);
export default managerRouter;
