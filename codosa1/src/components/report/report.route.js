import reportController from "../report/report.controller";
import { express, Router } from "express";
import reportValidate from "./report.validate";
const reportRouter = Router();
reportRouter.post("/product", reportValidate.checkReportProduct,reportController.reportProduct);
reportRouter.post("/category", reportValidate.checkReportCategory,reportController.reportCategory);
export default reportRouter;
