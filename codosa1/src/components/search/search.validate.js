import { validate, ValidationError, Joi } from "express-validation";
const validateSearch ={
  query: Joi.object({
    page: Joi.number().min(1).required(),
    perPage:Joi.number().min(1).max(30).required(),
    name: Joi.string()
      .required(),
  }),
}
export default {validateSearch};
