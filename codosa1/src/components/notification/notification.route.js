import notificationController from "./notification.controller";
import { express, Router } from "express";
import auth from "../utils/auth";

const notificationRoute = Router();

notificationRoute.get("/view/:page/:perPage",auth.passportStaff,auth.isStaff,notificationController.getNotification);
export default notificationRoute;