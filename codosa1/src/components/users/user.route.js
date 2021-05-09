import userController from "../users/user.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import userValidate from "./user.validate";
import errorHandller from "../utils/errorHandller";
const userRouter = Router();
userRouter.post(
  "/login",
  validate(userValidate.checkEmailPass),
  errorHandller(userController.userLogin)
);
userRouter.post(
  "/register",
  validate(userValidate.checkEmailNamePass),
  auth.checkUserExist,
  errorHandller(userController.userRegister)
  
);

userRouter.get("/info", auth.authen,auth.isUser, errorHandller(userController.getInfo));


export default userRouter;
