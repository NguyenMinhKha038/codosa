import reportController from "../report/report.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import reportValidate from "./report.validate";
import auth from "../utils/auth";
import permission from "../utils/permission"
const reportRouter = Router();
reportRouter.use(auth.passport,auth.authenticate([permission.MANAGER,permission.STAFF]))
reportRouter.get(
  "/product",
  validate(reportValidate.reportProduct),
  reportController.reportProduct
);
reportRouter.get(
  "/category",
  validate(reportValidate.reportCategory),
  reportController.reportCategory
);
export default reportRouter;
