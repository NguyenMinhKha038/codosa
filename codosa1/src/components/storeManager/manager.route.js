import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import managerController from "./manager.controller";
import managerValidate from "./manager.validate";
import permission from "../utils/permission"
import baseValidate from "../utils/validate";
const managerRouter = Router();
managerRouter.post(
  "/register",
  validate(baseValidate.validateRegister),
  managerController.managerRegister
);
managerRouter.post(
  "/login",
  validate(baseValidate.validateLogin),  //chu dat ten validate vd validate =login
  managerController.managerLogin
);
managerRouter.get("/me",auth.passport, auth.authenticate([permission.MANAGER]), managerController.getInfo);
export default managerRouter;
