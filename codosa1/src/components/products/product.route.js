import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import product from "../products/product.controller";
import productValidate from "./product.validate";

const productRouter = Router();
productRouter.post(
  "/add",
  auth.passportStaff,
  auth.isStaff,
  validate(productValidate.checkAddProduct),
  product.addProduct
);
productRouter.delete(
  "/delete",
  auth.passportStaff,
  auth.isStaff,
  validate(productValidate.checkNameProduct),
  product.deleteProduct
);
productRouter.put(
  "/update",
  auth.passportStaff,
  auth.isStaff,
  validate(productValidate.checkUpdateProduct),
  product.updateProduct
);
productRouter.post(
  "/get",
  auth.passportStaff,
  auth.isStaff,
  validate(productValidate.checkNameProduct),
  product.getProduct
);



export default productRouter;
