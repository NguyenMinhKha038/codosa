import { validate, ValidationError, Joi } from "express-validation";
const cartValidate = {
  body: Joi.object({
    product: Joi.array().required(),
  }),
};

export default { cartValidate };
