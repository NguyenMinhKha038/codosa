import { validate, ValidationError, Joi } from "express-validation";
const addCart = {
  body: Joi.object({
    product: Joi.array().items(Joi.object({productId:Joi.string().required(),amount:Joi.number().min(1).required()}).required()).required(),
  }),
};


export default {addCart} ;
