import notificationController from "./notification.controller";
import { express, Router } from "express";
import auth from "../utils/auth";
import permission from "../utils/permission"
const notificationRoute = Router();
notificationRoute.get(
  "/:page/:perPage",
  auth.passport,
  auth.authenticate([permission.MANAGER,permission.STAFF]),
  notificationController.getNotification
);
export default notificationRoute;
