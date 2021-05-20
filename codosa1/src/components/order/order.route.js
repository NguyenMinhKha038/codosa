import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import auth from "../utils/auth";
import orderController from "./order.controller";
import orderValidate from "./order.validate";

const orderRouter = Router();
orderRouter.post(
  "/create",
  auth.passportUser,
  auth.isUser,
  validate(orderValidate.order),
  orderController.createOrder
);
orderRouter.get("/get", auth.passportUser, auth.isUser, orderController.getOrder);
orderRouter.get(
  "/get-user-order",
  auth.isStaff,
  validate(orderValidate.email),
  orderController.getUserOrder
);
orderRouter.put(
  "/user-update",
  auth.passportUser,
  auth.isUser,
  validate(orderValidate.idAddress),
  orderController.updateOrder
);
orderRouter.delete(
  "/admin-delete",
  auth.isStaff,
  validate(orderValidate.id),
  orderController.adminDeleteOrder
);
orderRouter.delete(
  "/user-delete",
  auth.isUser,
  validate(orderValidate.id),
  orderController.userDeleteOrder
);
//status update
orderRouter.put(
  "/status-processing",
  auth.passportStaff,
  auth.isStaff,
  validate(orderValidate.id),
  orderController.processingUpdate
);
orderRouter.put(
  "/status-shipping",
  auth.passportStaff,
  auth.isStaff,
  validate(orderValidate.id),
  orderController.shippingUpdate
);
orderRouter.put(
  "/status-finish",
  auth.passportStaff,
  auth.isStaff,
  validate(orderValidate.id),
  orderController.finishUpdate
);

//get
orderRouter.get("/waiting",auth.passportStaff, auth.isStaff, orderController.getWaitingOrder);
orderRouter.get(
  "/processing",
  auth.passportStaff,
  auth.isStaff,
  orderController.getProcessingOrder
);
orderRouter.get(
  "/shipping",
  auth.passportStaff,
  auth.isStaff,
  orderController.getShippingOrder
);
orderRouter.get(
  "/finish",
  auth.passportStaff,
  auth.isStaff,
  orderController.getFinishOrder
);
export default orderRouter;
