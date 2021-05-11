import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
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
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.checkEmail, {}, {}),
  //managerValidate.checkEmail,
  errorHandller(managerController.deleteUser)
);

managerRouter.post(
  "/deletestaff",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.checkEmail, {}, {}),
  //managerValidate.checkEmail,
  errorHandller(managerController.deleteStaff)
);

managerRouter.post(
  "/updateuser",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.checkEmailNamePass, {}, {}),
  //managerValidate.checkEmailNamePass,
  errorHandller(managerController.updateUser)
);
managerRouter.post(
  "/updatestaff",
  auth.passportManager,
  auth.isManager,
  validate(managerValidate.checkEmailNamePass, {}, {}),
  //managerValidate.checkEmailNamePass,
  errorHandller(managerController.updateStaff)
);

managerRouter.get("/info", auth.passportManager,errorHandller(auth.isManager),errorHandller( managerController.getInfo));
managerRouter.post("/getuser",auth.passportManager, auth.isManager,validate(managerValidate.checkEmail), errorHandller(managerController.getUser));
managerRouter.post("/getstaff", auth.passportManager,auth.isManager,validate(managerValidate.checkEmail), errorHandller(managerController.getStaff));
export default managerRouter;
