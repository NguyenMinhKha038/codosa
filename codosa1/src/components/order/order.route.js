import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import auth from "../utils/auth";
import orderController from "./order.controller";
import orderValidate from "./order.validate"

const orderRouter = Router();
orderRouter.post("/create",auth.passportUser, auth.isUser, orderController.createOrder);
orderRouter.get("/get",auth.passportUser, orderController.getOrder);
orderRouter.post("/get", auth.checkAuth, validate(orderValidate.checkEmail),orderController.getUserOrder);
orderRouter.post("/update", auth.passportUser,auth.isUser, validate(orderValidate.checkIdAddress),orderController.updateOrder);
orderRouter.post(
  "/admin/delete",
  auth.checkAuth,
  validate(orderValidate.checkID, {}, {}),
  orderController.adminDeleteOrder
);
orderRouter.post("/user/delete", auth.isUser, validate(orderValidate.checkID),orderController.userDeleteOrder);
//status update
orderRouter.post(
  "/status/processing",
  auth.checkAuth,
  validate(orderValidate.checkID, {}, {}),
  orderController.processingUpdate
);
orderRouter.post(
  "/status/shipping",
  auth.checkAuth,
  validate(orderValidate.checkID, {}, {}),
  orderController.shippingUpdate
);
orderRouter.post(
  "/status/finish",
  auth.checkAuth,
  validate(orderValidate.checkID, {}, {}),
  orderController.finishUpdate
);

//get
orderRouter.get("/waiting", auth.checkAuth, orderController.getWaitingOrder);
orderRouter.get(
  "/processing",
  auth.checkAuth,
  orderController.getProcessingOrder
);
orderRouter.get("/shipping", auth.checkAuth, orderController.getShippingOrder);
orderRouter.get("/finish", auth.checkAuth, orderController.getFinishOrder);
export default orderRouter;
