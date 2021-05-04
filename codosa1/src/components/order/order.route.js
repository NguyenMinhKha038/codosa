import { express, Router } from "express";
import auth from "../utils/auth";
import orderController from "./order.controller";
import orderValidate from "./order.validate"

const orderRouter = Router();
orderRouter.get("/create", auth.isUser, orderController.createOrder);
orderRouter.get("/get", orderController.getOrder);
orderRouter.post("/get", auth.checkAuth, orderValidate.checkEmail,orderController.getUserOrder);
orderRouter.post("/update", auth.isUser, orderValidate.checkAddress,orderController.updateOrder);
orderRouter.post(
  "/admin/delete",
  auth.checkAuth,
  orderController.adminDeleteOrder
);
orderRouter.post("/user/delete", auth.isUser, orderValidate.checkID,orderController.userDeleteOrder);
//status update
orderRouter.post(
  "/status/processing",
  auth.checkAuth,
  orderValidate.checkID,
  orderController.processingUpdate
);
orderRouter.post(
  "/status/shipping",
  auth.checkAuth,
  orderValidate.checkID,
  orderController.shippingUpdate
);
orderRouter.post(
  "/status/finish",
  auth.checkAuth,
  orderValidate.checkID,
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
