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

const validateUpdateStatus = {
  params: Joi.object({
    orderId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    status:Joi.number().min(1).max(4).required()
  }),
}
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
  validateUpdateStatus,
  validateOrderId,
  validateAdminGetOrder
};
