import { validate, ValidationError, Joi } from "express-validation";
const cartValidate ={
    body: Joi.object({
        products: Joi.array()
          .required(),
        

      }),
}


export default {cartValidate};