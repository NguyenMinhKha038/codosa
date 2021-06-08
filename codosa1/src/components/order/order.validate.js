import { validate, ValidationError, Joi } from "express-validation";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
Joi.objectId = require("joi-objectid")(Joi);

const receiverInfor = {
  body: Joi.object({
    phone: Joi.string().length(10).required(),
    address: Joi.string()
      .required(),
  }),
};

const validateStatus = (req, res, next) => {
  const statusArr = [0, 1, 2, 3, 4];
  const status =Number(req.params.status)
  if (statusArr.includes(status)===false) {
    throw new BaseError({
      name: status,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.VALIDATE_STATUS,
    });
  }
  next();
};
export default {
  receiverInfor,
  validateStatus,
};
