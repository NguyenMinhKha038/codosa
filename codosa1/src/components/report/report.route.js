import userController from "../users/user.controller";
import cartController from "../cart/cart.controller";
import reportController from "../report/report.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../common/auth";
import validates from "../common/validate";
const reportRouter = Router();
reportRouter.post("/product",reportController.reportProduct);

export default reportRouter;