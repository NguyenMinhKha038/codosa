import { express, Router } from "express";
import auth from "../common/auth";
import orderController from "./order.controller";

const orderRouter = Router();
orderRouter.get("/create", auth.isUser, orderController.createOrder);
orderRouter.get("/get", orderController.getOrder);
orderRouter.post("/get", auth.checkAuth, orderController.getOrder);
orderRouter.post("/update", auth.isUser, orderController.updateOrder);
orderRouter.post(
  "/admin/delete",
  auth.checkAuth,
  orderController.adminDeleteOrder
);
orderRouter.post("/user/delete", auth.isUser, orderController.userDeleteOrder);
//status update
orderRouter.post(
  "/status/processing",
  auth.checkAuth,
  orderController.processingUpdate
);
orderRouter.post(
  "/status/shipping",
  auth.checkAuth,
  orderController.shippingUpdate
);
orderRouter.post(
  "/status/finish",
  auth.checkAuth,
  orderController.finishUpdate
);

//get
orderRouter.get("/waiting", orderController.getWaitingOrder);

export default orderRouter;
