import notificationController from "./notification.controller";

const notificationRoute = Router();

notificationRoute.get("/",notificationController.getNotification);