import { validate, ValidationError, Joi } from "express-validation";
const cartValidate ={
    body: Joi.object({
        productName: Joi.string()
          .regex(/[a-zA-Z0-9]{3,30}/)
          .required(),
        amount:Joi.number()
          .required()
      }),
}


export default {cartValidate};