import cartController from "../cart/cart.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import cartValidate from "./cart.validate";
const cartRouter = Router();

cartRouter.get("/info", cartController.getCart);
cartRouter.post("/add", validate(cartValidate.addCart), cartController.addCart);
export default cartRouter;
