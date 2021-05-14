import { validate, ValidationError, Joi } from "express-validation";
const checkAddProduct = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,40}/)
      .required(),
    amount: Joi.number().required(),
    price: Joi.number().required(),
    category: Joi.string()
      .regex(/[a-zA-Z0-9]{3,20}/)
      .required(),
    description: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
const checkNameProduct = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
const checkUpdateProduct = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,20}/)
      .required(),
    id: Joi.string()
      .regex(/[a-zA-Z0-9]{3,20}/)
      .required(),
    amount: Joi.number().required(),
    price: Joi.number().required(),
    
    newName: Joi.string()
      .regex(/[a-zA-Z0-9]{3,20}/)
      .required(),
  }),
};
export default { checkAddProduct, checkNameProduct, checkUpdateProduct };
