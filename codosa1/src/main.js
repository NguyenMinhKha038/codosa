import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoute from "../src/components/users/user.route";
import staffRoute from "../src/components/staffs/staff.route";
import managerRoute from "../src/components/storeManager/manager.route";
import productRoute from "../src/components/products/product.route";
import categoryRoute from "../src/components/category/category.route";
import searchRoute from "./components/search/search.route";
import imageRoute from "./components/image/image.route";
import orderRoute from "./components/order/order.route";
import reportRoute from "./components/report/report.route";
import database from "./config/connectDb";
import http from "http";

database();
dotenv.config();
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.server = http.createServer(app);
app.use("/user", userRoute);
app.use("/staff", staffRoute);
app.use("/manager", managerRoute);
app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/", searchRoute);
app.use("/image", imageRoute);
app.use("/order", orderRoute);
app.use("/report", reportRoute);

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
