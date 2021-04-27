import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../common/auth";
import validates from "../common/validate";
import product from "../products/product.controller";
import orderController from "./order.controller";

const orderRouter = Router();
orderRouter.get("/create",auth.isUser,orderController.createOrder);
orderRouter.get("/get",orderController.getOrder);
orderRouter.post("/update",auth.isUser,orderController.updateOrder);
orderRouter.post("/delete")

export default orderRouter;