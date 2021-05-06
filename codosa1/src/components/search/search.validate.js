import { validate, ValidationError, Joi } from "express-validation";
const checkNameSearch ={
    body: Joi.object({
        name: Joi.string()
          .regex(/[a-zA-Z0-9]{3,30}/)
          .required(),
      }),
}

export default {checkNameSearch};