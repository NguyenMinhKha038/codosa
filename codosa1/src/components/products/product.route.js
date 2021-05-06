import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import validates from "../utils/validate";
import product from "../products/product.controller";
import productValidate from "./product.validate";

const productRouter = Router();
productRouter.post(
  "/add",
  auth.checkAuth,
  validate(productValidate.checkAddProduct, {}, {}),
  product.addProduct
);
productRouter.post("/delete", auth.authen,auth.checkAuth, validate(productValidate.checkNameProduct, {}, {}),product.deleteProduct);
productRouter.post("/update", auth.authen,auth.checkAuth,validate(productValidate.checkUpdateProduct, {}, {}),product.updateProduct);
productRouter.post("/get",auth.authen, auth.checkAuth,validate(productValidate.checkNameProduct, {}, {}), product.getProduct);

export default productRouter;
