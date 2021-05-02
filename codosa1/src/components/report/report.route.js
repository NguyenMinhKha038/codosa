import reportController from "../report/report.controller";
import { express, Router } from "express";
const reportRouter = Router();
reportRouter.post("/product", reportController.reportProduct);
reportRouter.post("/category", reportController.reportCategory);
export default reportRouter;
