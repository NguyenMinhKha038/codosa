import userRoute from "../components/users/user.route";
import staffRoute from "../components/staffs/staff.route";
import managerRoute from "../components/storeManager/manager.route";
import productRoute from "../components/products/product.route";
import categoryRoute from "../components/category/category.route";
import searchRoute from "../components/search/search.route";
import imageRoute from "../components/image/image.route";
import orderRoute from "../components/order/order.route";
import reportRoute from "../components/report/report.route";
import cartRoute from "../components/cart/cart.route";
import notificationRoute from "../components/notification/notification.route";
import { express, Router } from "express";
const router = Router();
router.use("/user", userRoute);
router.use("/staff", staffRoute);
router.use("/manager", managerRoute);
router.use("/product", productRoute);
router.use("/category", categoryRoute);
router.use("/search", searchRoute);
router.use("/image", imageRoute);
router.use("/order", orderRoute);
router.use("/report", reportRoute);
router.use("/cart", cartRoute);
router.use("/notification", notificationRoute);

export default router;