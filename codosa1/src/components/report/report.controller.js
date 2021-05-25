import orderModel from "../order/order.model";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import {reportService} from "./report.service"
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";

const reportProduct = async (req, res, next) => {
  try {
    const { toDay, fromDay } = req.body;
    const report = await reportService.reportProduct({finishDay: { $gte: new Date(fromDay), $lte: new Date(toDay) }});
    if (report.length == 0) {
      throw new BaseError({
        namw: "Product",
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, report);
  } catch (error) {
    next(error);
  }
};

const reportCategory = async (req, res, next) => {
  try {
    const { fromDay, toDay } = req.body;
    const report = await reportService.reportCategory({finishDay: { $gte: new Date(fromDay), $lte: new Date(toDay) }});
    if (report.length == 0) {
      throw new BaseError({
        namw: "Product",
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, report);
  } catch (error) {
    next(error);
  }
};

export default { reportProduct, reportCategory };
