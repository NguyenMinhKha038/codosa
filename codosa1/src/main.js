import express from "express";
import dotenv from "dotenv";
dotenv.config();
import swaggerUi from "swagger-ui-express";
import userRoute from "../src/components/users/user.route";
import staffRoute from "../src/components/staffs/staff.route";
import managerRoute from "../src/components/storeManager/manager.route";
import productRoute from "../src/components/products/product.route";
import categoryRoute from "../src/components/category/category.route";
import searchRoute from "./components/search/search.route";
import imageRoute from "./components/image/image.route";
import orderRoute from "./components/order/order.route";
import reportRoute from "./components/report/report.route";
import cartRoute from "./components/cart/cart.route";
import database from "./config/connectDb";
import notificationRoute from "./components/notification/notification.route";
import swaggerDocument from "./components/utils/swagger.json";
import http from "http";
import auth from "./components/utils/auth";

database();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoute);
app.use("/staff", staffRoute);
app.use("/manager", managerRoute);
app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/", searchRoute);

app.use("/image", imageRoute);
app.use("/order", orderRoute);
app.use("/report", reportRoute);
app.use("/cart", cartRoute);
app.use("/notification", notificationRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.httpCode = 404;
  next(error);
});

app.use((error, req, res, next) => {
  if (error.details) {
    error.details.body.forEach((element) => {
      error.message = element.message;
    });
    return res.status(error.statusCode || 500).json({
      error: {
        status: error.statusCode || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }
  return res.status(error.httpCode || 500).json({
    error: {
      status: error.httpCode || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
