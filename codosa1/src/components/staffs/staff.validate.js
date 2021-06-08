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

export default { EmailNamePass };
