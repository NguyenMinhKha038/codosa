import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import product from "../products/product.controller";
import productValidate from "./product.validate";

const productRouter = Router();
productRouter.use(auth.passport,auth.isManagerOrStaff)
productRouter.post(
  "/add",
  validate(productValidate.addProduct),
  product.addProduct
);
productRouter.delete(
  "/delete",
  validate(productValidate.nameProduct),
  product.deleteProduct
);
productRouter.put(
  "/update",
  validate(productValidate.updateProduct),
  product.updateProduct
);
productRouter.get(
  "/get",
  validate(productValidate.nameProduct),
  product.getProduct
);



export default productRouter;
