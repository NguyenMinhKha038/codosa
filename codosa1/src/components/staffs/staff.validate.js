import { validate, ValidationError, Joi } from "express-validation";
import { isValidObjectId } from "mongoose";
const EmailNamePass = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
const Email = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
const EmailPass = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
const validateId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    throw new BaseError({
      name: req.params.id,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.MUST_BE_OBJECTID,
    });
  }
  next();
};
export default { EmailNamePass, Email, EmailPass,validateId };
