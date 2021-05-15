import { validate, ValidationError, Joi } from "express-validation";
const addCart = {
  body: Joi.object({
    product: Joi.array().required(),
  }),
};


export default {addCart} ;
