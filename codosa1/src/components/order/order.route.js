import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import auth from "../utils/auth";
import orderController from "./order.controller";
import orderValidate from "./order.validate";

const userOrderRouter = Router();
const adminOrderRouter = Router();
const orderRouter=Router();
orderRouter.use("/user",userOrderRouter);
userOrderRouter.use(auth.passport, auth.isUser);
userOrderRouter.post(
  "/",
  validate(orderValidate.order),
  orderController.createOrder
);
userOrderRouter.put(
  "/:id",
  orderValidate.validateId,
  validate(orderValidate.order),
  orderController.updateOrder
);
userOrderRouter.get("/", orderController.getOrder);
userOrderRouter.delete(
  "/:id",
  orderValidate.validateId,
  orderController.userDeleteOrder
);

orderRouter.use("/admin",adminOrderRouter);
adminOrderRouter.use(auth.passport, auth.isStaff);
adminOrderRouter.get(
  "/:id",
  orderValidate.validateId,
  orderController.getUserOrder
);
adminOrderRouter.delete(
  "/:id",
  orderValidate.validateId,
  orderController.adminDeleteOrder
);
//status update
adminOrderRouter.put(
  "/status/:orderId/:status",
  orderValidate.validateStatus,
  orderValidate.validateId,
  orderController.updateStatus
);
adminOrderRouter.get("/status/:status", orderValidate.validateStatus,orderController.adminGetOrder);

export default orderRouter ;
