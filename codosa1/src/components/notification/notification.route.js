import notificationController from "./notification.controller";
import auth from "../utils/auth";

const notificationRoute = Router();

notificationRoute.get("/notification",auth.isStaff,notificationController.getNotification);