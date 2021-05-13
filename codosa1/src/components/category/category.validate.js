import { validate, ValidationError, Joi } from "express-validation";
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
export default { categoryValidate, updateCategory };
