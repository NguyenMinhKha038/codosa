import userController from "../users/user.controller";
import cartController from "../cart/cart.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import validates from "../utils/validate";
const userRouter = Router();
userRouter.post(
  "/login",
  validate(validates.validateLogin, {}, {}),
  userController.userLogin
);
userRouter.post(
  "/register",
  validate(validates.validateRegister, {}, {}),
  auth.checkUserExist,
  userController.userRegister
);
userRouter.post(
  "/addcart",
  auth.isUser,
  auth.checkUpdateCart,
  cartController.addCart
);
userRouter.get("/info", auth.isUser, userController.getInfo);


export default userRouter;
