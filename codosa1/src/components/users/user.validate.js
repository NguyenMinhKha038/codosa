import { validate, ValidationError, Joi } from "express-validation";

const validateAdminGet = {
  query: Joi.object({
    name:Joi.string(),
    status:Joi.number().min(0).max(1),
    email: Joi.string().email()
  }),
};
export default { validateAdminGet };