import { validate, ValidationError, Joi } from "express-validation";
const addProduct = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,40}/)
      .required(),
    amount: Joi.number().required(),
    price: Joi.number().required(),
    category: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    description: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
const nameProduct = {
  body: Joi.object({
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
const updateProduct = {
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
export default { addProduct, nameProduct, updateProduct };
