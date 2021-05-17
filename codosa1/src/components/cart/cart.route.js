import cartController from "../cart/cart.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import cartValidate from "./cart.validate";
const cartRouter = Router();

cartRouter.get("/info", auth.passportUser,auth.isUser, cartController.getCart);
cartRouter.post("/add", auth.passportUser,auth.isUser,validate(cartValidate.addCart),cartController.addCart);

export default cartRouter;