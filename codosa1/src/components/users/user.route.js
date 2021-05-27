import userController from "../users/user.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import userValidate from "./user.validate";
import permission from "../utils/permission"

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
userRouter.get("/me", auth.passport, auth.authenticate([permission.USER]), userController.getInfo);
export default userRouter;
