import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import auth from "../utils/auth";
import orderController from "./order.controller";
import orderValidate from "./order.validate";
import permission from "../utils/permission"

const userOrderRouter = Router();
const adminOrderRouter = Router();
const orderRouter=Router();
userOrderRouter.use(auth.passport, auth.authenticate([permission.USER]));
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
adminOrderRouter.use(auth.passport, auth.authenticate([permission.STAFF,permission.MANAGER]));
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

orderRouter.use("/user",userOrderRouter)
orderRouter.use("/admin",adminOrderRouter);


export default orderRouter ;
