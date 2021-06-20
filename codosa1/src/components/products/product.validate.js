import { validate, ValidationError, Joi } from "express-validation";

const productInfor = {
  body: Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    categoryId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    productId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

const productId = {
  params: Joi.object({
    productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const validateGetProduct = {
  query: Joi.object({
    page: Joi.number().min(1).required(),
    perPage: Joi.number().min(1).max(30).required()
  }),
};
export default { productInfor, productId, validateGetProduct };
