import notificationController from "./notification.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import notificationValidate from "./notification.validate";
import permission from "../utils/permission"
const notificationRoute = Router();
notificationRoute.get(
  "/",
  auth.passport,
  auth.authenticate([permission.MANAGER,permission.STAFF]),
  validate(notificationValidate.validateGetNotification),
  notificationController.getNotification
);
export default notificationRoute;
