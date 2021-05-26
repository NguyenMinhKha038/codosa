import { validate, ValidationError, Joi } from "express-validation";
import { isValidObjectId } from "mongoose";
const categoryValidate = {
  body: Joi.object({
    category: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

const updateCategory = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    newname: Joi.string()
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
export default { categoryValidate, updateCategory,validateId };
