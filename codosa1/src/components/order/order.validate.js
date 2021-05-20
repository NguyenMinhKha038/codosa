import { validate, ValidationError, Joi } from "express-validation";
const email = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

const address = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{20,50}/)
      .required(),
  }),
};
const id = {
  body: Joi.object({
    orderId: Joi.string().required(),
  }),
};
const idAddress = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{20,50}/)
      .required(),
      orderId: Joi.string().required(),
  }),
};
const order = {
  body: Joi.object({
    phone: Joi.string().length(10).required(),
    address: Joi.string()
      .regex(/[a-zA-Z0-9]{5,50}/)
      .required(),
  }),
};
export default {
  email,
  address,
  id,
  idAddress,
  order,
};
