import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import auth from "../utils/auth";
import orderController from "./order.controller";
import orderValidate from "./order.validate";
import permission from "../utils/permission"
import baseValidate from "../utils/validate"

const userRouter = Router();
const adminRouter = Router();
const orderRouter=Router();
userRouter.use(auth.passport, auth.authenticate([permission.USER]));
adminRouter.use(auth.passport, auth.authenticate([permission.STAFF,permission.MANAGER]));
userRouter.post(
  "/",
  validate(orderValidate.receiverInfor),
  orderController.createOrder
);
userRouter.put(
  "/:orderId",
  baseValidate.validateId,
  validate(orderValidate.receiverInfor),
  orderController.updateOrder
);
userRouter.get("/", orderController.userGetOrder);
userRouter.delete(
  "/:orderId",
  baseValidate.validateId,
  orderController.userDeleteOrder
);

adminRouter.get(
  "/:userId",
  baseValidate.validateId,
  orderController.adminGetOrder
);
adminRouter.delete(
  "/:orderId",
  baseValidate.validateId,
  orderController.adminDeleteOrder
);
//status update
adminRouter.put(
  "/status/:orderId/:status",
  orderValidate.validateStatus,
  baseValidate.validateId,
  orderController.updateStatus
);
adminRouter.get("/status/:status", orderValidate.validateStatus,orderController.adminGetOrderByStatus);
orderRouter.use("/user",userRouter)
orderRouter.use("/admin",adminRouter);


export default orderRouter ;
