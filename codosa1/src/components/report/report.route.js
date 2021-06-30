import reportController from "../report/report.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import reportValidate from "./report.validate";
import auth from "../utils/auth";
import permission from "../utils/permission"
const reportRouter = Router();
reportRouter.use(auth.passport,auth.authenticate([permission.MANAGER,permission.STAFF]))
reportRouter.post(
  "/product",
  validate(reportValidate.Day),
  reportController.reportProduct
);
reportRouter.post(
  "/category",
  validate(reportValidate.Day),
  reportController.reportCategory
);
export default reportRouter;
