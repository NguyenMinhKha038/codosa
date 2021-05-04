import { validate, ValidationError, Joi } from "express-validation";
const validateRegister = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    file: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
  }),
};
const validateLogin = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
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
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

export default {
  validateRegister,
  validateLogin,
  validateEmail,
  validateEmailName,
};
