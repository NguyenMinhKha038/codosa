import { validate, ValidationError, Joi } from "express-validation";
import validateId from "joi-oid";
const productInfor = {
  body: Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    categoryId: validateId.objectId(),
  }),
};

const categoryId = {
  body: Joi.object({
    categoryId: validateId.objectId(),
  }),
};
export default { productInfor, categoryId };
