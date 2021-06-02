import { validate, ValidationError, Joi } from "express-validation";
import { isValidObjectId } from "mongoose";
const EmailNamePass = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

export default { EmailNamePass };
