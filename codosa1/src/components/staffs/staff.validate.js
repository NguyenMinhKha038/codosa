import { validate, ValidationError, Joi } from "express-validation";
const EmailNamePass = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .required(),
    name: Joi.string()
      .required(),
  }),
};
const validateManagerGet = {
  query: Joi.object({
    name:Joi.string(),
    status:Joi.number().min(0).max(1),
    email: Joi.string().email(),
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
  }),
};
const validateId = {
  params: Joi.object({
    productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};
export default { EmailNamePass,validateManagerGet };
