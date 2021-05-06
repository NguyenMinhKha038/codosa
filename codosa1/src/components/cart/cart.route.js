import cartController from "../cart/cart.controller";
import { express, Router } from "express";
import auth from "../utils/auth";
import cartValidate from "./cart.validate";
const cartRouter = Router();

cartRouter.get("/cart", auth.isUser, cartController.getCart);
cartRouter.post("/updatecart", auth.isUser, validate(cartValidate.cartValidate, {}, {}),cartController.updateCart);
cartRouter.post("/addcart", auth.isUser, validate(cartValidate.cartValidate, {}, {}),cartController.addCart);