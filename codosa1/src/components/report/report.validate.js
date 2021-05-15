import { validate, ValidationError, Joi } from "express-validation";
const checkReportProduct = {
  body: Joi.object({
    fromDay: Joi.date().required(),
    toDay: Joi.date().required()
    
  }),
};
const checkReportCategory = {
  body: Joi.object({
    fromDay: Joi.date().required(),
    toDay: Joi.date().required()
  
  }),
};
export default { checkReportProduct, checkReportCategory };
