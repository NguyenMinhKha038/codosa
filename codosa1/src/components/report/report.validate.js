import { validate, ValidationError, Joi } from "express-validation";
const checkReportProduct = {
  body: Joi.object({
    fromDay: Joi.date().required(),
    toDay: Joi.date().required(),
    _id: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
const checkReportCategory = {
  body: Joi.object({
    fromDay: Joi.date().required(),
    toDay: Joi.date().required(),
    name: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
export default { checkReportProduct, checkReportCategory };
