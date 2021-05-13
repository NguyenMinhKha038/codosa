import { validate, ValidationError, Joi } from "express-validation";

const checkEmailNamePass = {
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
const checkEmail = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
const checkEmailPass = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
export default { checkEmailNamePass, checkEmail, checkEmailPass };
