import { validate, ValidationError, Joi } from "express-validation";
import { isValidObjectId } from "mongoose";
const categoryValidate = {
  body: Joi.object({
    category: Joi.string()
      .required(),
  }),
};

const updateCategory = {
  body: Joi.object({
    name: Joi.string()
      .required(),
    newname: Joi.string()
      .required(),
  }),
};

export default { categoryValidate, updateCategory };
