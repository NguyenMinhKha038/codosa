import { validate, ValidationError, Joi } from "express-validation";
const checkEmail = {
    body: Joi.object({
        email: Joi.string().email().required(),
      }),
}

const checkAddress ={
    body: Joi.object({
        name: Joi.string()
          .regex(/[a-zA-Z0-9]{20,50}/)
          .required(),
      }),
}
const checkID ={
    body: Joi.object({
        _id: Joi.string()
          .required(),
      }),

}
const checkIdAddress ={
    body: Joi.object({
        name: Joi.string()
          .regex(/[a-zA-Z0-9]{20,50}/)
          .required(),
        _id: Joi.string()
          .required(),
      }),
}
export default {checkEmail,checkAddress,checkID,checkIdAddress}