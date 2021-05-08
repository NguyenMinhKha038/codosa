import reportController from "../report/report.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import reportValidate from "./report.validate";
import auth from "../utils/auth"
const reportRouter = Router();
reportRouter.post("/product", validate(reportValidate.checkReportProduct),auth.authen,reportController.reportProduct);
reportRouter.post("/category", validate(reportValidate.checkReportCategory),auth.authen,auth.isManager,reportController.reportCategory);
export default reportRouter;
