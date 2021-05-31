import cartController from "../cart/cart.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import cartValidate from "./cart.validate";
import permission from "../utils/permission"
import auth from "../utils/auth";
const cartRouter = Router(),
userRouter = Router();
userRouter.use(auth.passport, auth.authenticate([permission.USER]));
userRouter.get("/", cartController.getCart);
cartRouter.post("/", validate(cartValidate.addCart), cartController.addCart);
cartRouter.use('/user',userRouter)
export default cartRouter;

/**
 * cart
 * create: api/cart 
 * update: api/cart/:id
 * get: api/cart
 * api/cart/:id/cancel
 */