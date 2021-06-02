import { validate, ValidationError, Joi } from "express-validation";

const Day = {
  body: Joi.object({
    toDay: Joi.date()
      .required(),
    fromDay: Joi.date().less(Joi.ref("toDay")).required(),
  }),
};
export default {Day};
