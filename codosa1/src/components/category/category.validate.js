import { validate, ValidationError, Joi } from "express-validation";
const categoryValidate = {
  body: Joi.object({
    category: Joi.string().required(),
  }),
};

const updateCategory = {
  body: Joi.object({
    newname: Joi.string().required(),
  }),
};
const validateCategoryIdInParams = {
  params: Joi.object({
    categoryId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};
const validateCategoryIdInQuery = {
  query: Joi.object({
    categoryId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};
export default {
  categoryValidate,
  updateCategory,
  validateCategoryIdInParams,
  validateCategoryIdInQuery,
};
