import reportController from "../report/report.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import reportValidate from "./report.validate";
import auth from "../utils/auth";
import errorHandller from "../utils/errorHandller";
const reportRouter = Router();
reportRouter.post(
  "/product",
  validate(reportValidate.checkReportProduct),
  auth.passportManager,
  auth.isManager,
  errorHandller(reportController.reportProduct)
);
reportRouter.post(
  "/category",
  validate(reportValidate.checkReportCategory),
  auth.passportManager,
  auth.isManager,
  errorHandller(reportController.reportCategory)
);
export default reportRouter;
