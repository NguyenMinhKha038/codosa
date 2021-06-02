import { validate, ValidationError, Joi } from "express-validation";
import { isValidObjectId } from "mongoose";
const productInfor = {
  body: Joi.object({
    name: Joi.string()
      .required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string()
      .regex(/[a-zA-Z0-9]{10,60}/)
      .required(),
  }),
};

export default { productInfor};
