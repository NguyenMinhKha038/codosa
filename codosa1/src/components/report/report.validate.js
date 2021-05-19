import { validate, ValidationError, Joi } from "express-validation";
const checkReportProduct = {
  body: Joi.object({
    fromDay: Joi.date()
      .less(Joi.ref("toDay"))
      .required()
      .error((errors) => console.log(errors)),
    toDay: Joi.date()
      .required()
      .error((errors) => console.log(errors)),
  }),
};
const checkReportCategory = {
  body: Joi.object({
    toDay: Joi.date()
      .required()
      .error((errors) => console.log(errors)),
    fromDay: Joi.date().less(Joi.ref("toDay")).required(),
  }),
};
export default { checkReportProduct, checkReportCategory };
