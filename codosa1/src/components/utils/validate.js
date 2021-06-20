import { validate, ValidationError, Joi } from "express-validation";
import { isValidObjectId } from "mongoose";
const validateRegister = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
const validateLogin = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
const validateEmail = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
const validateEmailName = {
  body: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
  }),
};
const validateNamePass = {
  body: Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
const validateEmailNamePass = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
const validateId = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};
export default {
  validateRegister,
  validateLogin,
  validateEmail,
  validateEmailName,
  validateId,
  validateNamePass,
  validateEmailNamePass
};
