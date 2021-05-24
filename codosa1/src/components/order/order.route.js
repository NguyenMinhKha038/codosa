import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import auth from "../utils/auth";
import orderController from "./order.controller";
import orderValidate from "./order.validate";

const orderRouter = Router();
orderRouter.post(
  "/create",
  auth.passport,
  auth.isUser,
  validate(orderValidate.order),
  orderController.createOrder
);
orderRouter.put(
  "/user-order",
  auth.passport,
  auth.isUser,
  validate(orderValidate.idAddress),
  orderController.updateOrder
);
orderRouter.get("/get", auth.passport, auth.isUser, orderController.getOrder);
orderRouter.delete(
  "/user-delete",
  auth.passport,
  auth.isUser,
  validate(orderValidate.id),
  orderController.userDeleteOrder
);
orderRouter.use(auth.passport, auth.isStaff);
orderRouter.get(
  "/user-order",
  validate(orderValidate.email),
  orderController.getUserOrder
);
orderRouter.delete(
  "/admin-delete",
  validate(orderValidate.id),
  orderController.adminDeleteOrder
);
//status update
orderRouter.put(
  "/processing",
  validate(orderValidate.id),
  orderController.processingUpdate
);
orderRouter.put(
  "/shipping",
  validate(orderValidate.id),
  orderController.shippingUpdate
);
orderRouter.put(
  "/finish",
  validate(orderValidate.id),
  orderController.finishUpdate
);

//get
orderRouter.get(
  "/waiting",
  auth.passport,
  auth.isStaff,
  orderController.getWaitingOrder
);
orderRouter.get(
  "/processing",
  orderController.getProcessingOrder
);
orderRouter.get(
  "/shipping",
  auth.passport,
  auth.isStaff,
  orderController.getShippingOrder
);
orderRouter.get(
  "/finish",
  orderController.getFinishOrder
);
export default orderRouter;
