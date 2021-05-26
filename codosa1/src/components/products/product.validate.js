import { validate, ValidationError, Joi } from "express-validation";
import { isValidObjectId } from "mongoose";
const addProduct = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,40}/)
      .required(),
    amount: Joi.number().required(),
    price: Joi.number().required(),
    category: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    description: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
const nameProduct = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
const updateProduct = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,20}/)
      .required(),
    id: Joi.string()
      .regex(/[a-zA-Z0-9]{3,20}/)
      .required(),
    amount: Joi.number().required(),
    price: Joi.number().required(),

    newName: Joi.string()
      .regex(/[a-zA-Z0-9]{3,20}/)
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
export default { addProduct, nameProduct, updateProduct, validateId };
