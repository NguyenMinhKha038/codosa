import { validate, ValidationError, Joi } from "express-validation";
import { isValidObjectId } from "mongoose";
const validateRegister = {
  body: Joi.object({
    name: Joi.string()
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
  }),
};
const validateLogin = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .required(),
  }),
};
const validateEmail = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
const validateEmailName = {
  body: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string()
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
export default {
  validateRegister,
  validateLogin,
  validateEmail,
  validateEmailName,
  validateId
};
