import reportController from "../report/report.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import reportValidate from "./report.validate";
import auth from "../utils/auth";
import errorHandller from "../utils/errorHandller";
const reportRouter = Router();
reportRouter.post(
  "/product",
  
  auth.passportManager,
  auth.isManager,
  validate(reportValidate.checkReportProduct),
  reportController.reportProduct
);
reportRouter.post(
  "/category",
  auth.passportManager,
  auth.isManager,
  validate(reportValidate.checkReportCategory),
  reportController.reportCategory
);
export default reportRouter;
