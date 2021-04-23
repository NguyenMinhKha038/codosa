import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../common/auth";
import validates from "../common/validate";
import managerController from "./manager.controller";
import product from "../products/product.controller";
const managerRouter = Router();

managerRouter.post(
  "/register",
  validate(validates.validateRegister, {}, {}),
  auth.checkManagerExist,
  managerController.managerRegister
);

managerRouter.post(
  "/login",
  validate(validates.validateLogin, {}, {}),
  managerController.managerLogin
);

managerRouter.post(
  "/deleteuser",
  auth.isManager,
  validate(validates.validateEmail, {}, {}),
  managerController.deleteUser
);

managerRouter.post(
  "/deletestaff",
  auth.isManager,
  validate(validates.validateEmail, {}, {}),
  managerController.deleteStaff
);

managerRouter.post(
  "/updateuser",
  auth.isManager,
  validate(validates.validateRegister, {}, {}),
  managerController.updateUser
);
managerRouter.post(
  "/updatestaff",
  auth.isManager,
  validate(validates.validateRegister, {}, {}),
  managerController.updateStaff
);

managerRouter.get("/info", auth.isManager, managerController.getInfo);
managerRouter.post("/getuser", auth.checkAuth, managerController.getUser);
managerRouter.post("/getstaff", auth.checkAuth, managerController.getStaff);
export default managerRouter;
