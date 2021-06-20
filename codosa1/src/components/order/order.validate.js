import { validate, ValidationError, Joi } from "express-validation";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
Joi.objectId = require("joi-objectid")(Joi);

const receiverInfor = {
  body: Joi.object({
    phone: Joi.string().length(10).required(),
    address: Joi.string().required(),
  }),
};

const validateStatus = (req, res, next) => {
  const statusArr = [0, 1, 2, 3, 4];
  const status = Number(req.params.status);
  if (statusArr.includes(status) === false) {
    throw new BaseError({
      name: status,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.VALIDATE_STATUS,
    });
  }
  next();
};
const validateOrderId = {
  params: Joi.object({
    orderId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};
const validateAdminGetOrder= {
  query: Joi.object({
    userId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/),
    status:Joi.number().min(1).max(4),
    phone:Joi.string().length(10),
    finishDay: Joi.date(),
    createdAt:Joi.date()
  
  }),
};
export default {
  receiverInfor,
  validateStatus,
  validateOrderId,
  validateAdminGetOrder
};
