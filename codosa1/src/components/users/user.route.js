import userController from "../users/user.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import userValidate from "./user.validate";

const userRouter = Router();
userRouter.post(
  "/login",
  validate(userValidate.checkEmailPass),
  userController.userLogin
);
userRouter.post(
  "/register",
  validate(userValidate.checkEmailNamePass),
  userController.userRegister
);
userRouter.get("/info", auth.passport, auth.isUser, userController.getInfo);

export default userRouter;
