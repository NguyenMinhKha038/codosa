import notificationController from "./notification.controller";
import { express, Router } from "express";

const notificationRoute = Router();

notificationRoute.get("/view/:page/:perPage",notificationController.getNotification);
export default notificationRoute;