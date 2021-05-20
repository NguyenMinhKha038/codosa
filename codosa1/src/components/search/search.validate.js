import { validate, ValidationError, Joi } from "express-validation";
const nameSearch ={
    body: Joi.object({
        name: Joi.string()
          .regex(/[a-zA-Z0-9]{3,40}/)
          .required(),
      }),
}

export default {nameSearch};