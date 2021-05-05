import userController from "../users/user.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import userValidate from "./user.validate";
const userRouter = Router();
userRouter.post(
  "/login",
  // validate(validates.validateLogin, {}, {}),
  userValidate.checkEmailPass,
  userController.userLogin
);
userRouter.post(
  "/register",
  // validate(validates.validateRegister, {}, {}),
  userValidate.checkEmailNamePass,
  auth.checkUserExist,
  userController.userRegister
);

userRouter.get("/info", auth.isUser, userController.getInfo);


export default userRouter;
