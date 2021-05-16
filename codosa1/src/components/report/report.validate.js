import { validate, ValidationError, Joi } from "express-validation";
const checkReportProduct = {
  body: Joi.object({
    fromDay: Joi.date()
      .less(Joi.ref("toDay"))
      .required()
      .error((errors) => console.log(errors))
      .messages({
        "string.base": `"a" should be a type of 'text'`,
        "string.empty": `"a" cannot be an empty field`,
        "string.min": `"a" should have a minimum length of {#limit}`,
        "any.required": `"a" is a required field`,
      }),
    toDay: Joi.date()
      .max("now")
      .required()
      .error((errors) => console.log(errors)),
  }),
};
const checkReportCategory = {
  body: Joi.object({
    toDay: Joi.date()
      .max("now")
      .required()
      .error((errors) => console.log(errors)),
    fromDay: Joi.date()
      .less(Joi.ref("toDay"))
      .required()
      .error((errors) => console.log(errors))
      .messages({
        "path.['toDay']": `"a" should be a type of 'text'`,
        "string.empty": `"a" cannot be an empty field`,
        "string.min": `"a" should have a minimum length of {#limit}`,
        "any.required": `"a" is a required field`,
      }),
  }),
};
export default { checkReportProduct, checkReportCategory };
