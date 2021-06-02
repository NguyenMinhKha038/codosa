import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import auth from "../utils/auth";
import orderController from "./order.controller";
import orderValidate from "./order.validate";
import permission from "../utils/permission"
import baseValidate from "../utils/validate"

const userOrderRouter = Router();
const adminOrderRouter = Router();
const orderRouter=Router();
userOrderRouter.use(auth.passport, auth.authenticate([permission.USER]));
adminOrderRouter.use(auth.passport, auth.authenticate([permission.STAFF,permission.MANAGER]));
userOrderRouter.post(
  "/",
  validate(orderValidate.receiverInfor),
  orderController.createOrder
);
userOrderRouter.put(
  "/:orderId",
  baseValidate.validateId,
  validate(orderValidate.receiverInfor),
  orderController.updateOrder
);
userOrderRouter.get("/", orderController.getOrder);
userOrderRouter.delete(
  "/:orderId",
  baseValidate.validateId,
  orderController.userDeleteOrder
);

adminOrderRouter.get(
  "/:userId",
  baseValidate.validateId,
  orderController.getUserOrder
);
adminOrderRouter.delete(
  "/:orderId",
  baseValidate.validateId,
  orderController.adminDeleteOrder
);
//status update
adminOrderRouter.put(
  "/status/:orderId/:status",
  orderValidate.validateStatus,
  baseValidate.validateId,
  orderController.updateStatus
);
adminOrderRouter.get("/status/:status", orderValidate.validateStatus,orderController.adminGetOrder);
orderRouter.use("/user",userOrderRouter)
orderRouter.use("/admin",adminOrderRouter);


export default orderRouter ;
