import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import auth from "../utils/auth";
import orderController from "./order.controller";
import orderValidate from "./order.validate";
import permission from "../utils/permission";
import baseValidate from "../utils/validate";

const userRouter = Router();
const adminRouter = Router();
const mainRouter = Router();
userRouter.use(auth.passport, auth.authenticate([permission.USER]));
adminRouter.use(
  auth.passport,
  auth.authenticate([permission.STAFF, permission.MANAGER])
);
userRouter.post(
  "/",
  validate(orderValidate.receiverInfor),
  orderController.createOrder
);
userRouter.put(
  "/:orderId",
  validate(orderValidate.validateOrderId),
  validate(orderValidate.receiverInfor),
  orderController.updateOrder
);
userRouter.get(
  "/",
  orderController.userGetOrder
);
userRouter.delete(
  "/:orderId",
  validate(orderValidate.validateOrderId),
  orderController.userDeleteOrder
);
adminRouter.get(
  "/",
  validate(orderValidate.validateAdminGetOrder),
  orderController.adminGetOrder
);
adminRouter.delete(
  "/:orderId",
  validate(orderValidate.validateOrderId),
  orderController.adminDeleteOrder
);
//status update
adminRouter.put(
  "/status/:orderId/:status",
  validate(orderValidate.validateUpdateStatus),
  orderController.updateStatus
);

mainRouter.use("/user", userRouter);
mainRouter.use("/admin", adminRouter);

export default mainRouter;
