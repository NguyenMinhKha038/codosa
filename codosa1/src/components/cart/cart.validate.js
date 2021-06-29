import { validate, ValidationError, Joi } from "express-validation";
const productsOfCart = {
  body: Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
          quantity: Joi.number().min(1).required(),
        }).required()
      )
      .required(),
  }),
};


export default { productsOfCart };
