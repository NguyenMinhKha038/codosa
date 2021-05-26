import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import product from "../products/product.controller";
import productValidate from "./product.validate";

const productRouter = Router();
productRouter.use(auth.passport,auth.isManagerOrStaff)
productRouter.post(
  "/",
  validate(productValidate.addProduct),
  product.addProduct
);
productRouter.delete(
  "/:id",
  productValidate.validateId,
  product.deleteProduct
);
productRouter.put(
  "/:id",
  productValidate.validateId,
  validate(productValidate.updateProduct),
  product.updateProduct
);
productRouter.get(
  "/:id",
  productValidate.validateId,
  product.getProduct
);



export default productRouter;
