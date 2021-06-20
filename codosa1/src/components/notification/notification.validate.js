import { validate, ValidationError, Joi } from "express-validation";
const validateGetNotification ={
  query: Joi.object({
    page: Joi.number().min(1).required(),
    perPage:Joi.number().min(1).max(30).required()
  }),
}
export default {validateGetNotification};