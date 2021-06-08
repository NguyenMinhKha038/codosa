import cartController from "../cart/cart.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import cartValidate from "./cart.validate";
import permission from "../utils/permission";
import auth from "../utils/auth";
const cartRouter = Router();
const userRouter = Router();
userRouter.use(auth.passport, auth.authenticate([permission.USER]));
userRouter.get("/", cartController.getCart);
userRouter.post("/", validate(cartValidate.productsOfCart), cartController.addCart);
userRouter.put(
  "/:cartId",
  validate(cartValidate.productsOfCart),
  cartController.updateCart
);
cartRouter.use("/user", userRouter);
export default cartRouter;

/**
 * cart
 * create: api/cart
 * update: api/cart/:id
 * get: api/cart
 * api/cart/:id/cancel
 */
