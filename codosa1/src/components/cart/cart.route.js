import cartController from "../cart/cart.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import cartValidate from "./cart.validate";
import auth from "../utils/auth";
const cartRouter = Router();
cartRouter.use(auth.passport, auth.isUser);
cartRouter.get("/", cartController.getCart);
cartRouter.post("/", validate(cartValidate.addCart), cartController.addCart);
export default cartRouter;

/**
 * cart
 * create: api/cart 
 * update: api/cart/:id
 * get: api/cart
 * api/cart/:id/cancel
 */