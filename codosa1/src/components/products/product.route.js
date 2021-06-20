import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import product from "../products/product.controller";
import productValidate from "./product.validate";
import permission from "../utils/permission";

const productRouter = Router();
productRouter.get(
  "/",
  validate(productValidate.validateGetProduct),
  product.getProduct
);
productRouter.use(
  auth.passport,
  auth.authenticate([permission.MANAGER, permission.STAFF])
);
productRouter.post(
  "/",
  validate(productValidate.productInfor),
  product.addProduct
);
productRouter.delete(
  "/:productId",
  validate(productValidate.productId),
  product.deleteProduct
);
productRouter.put(
  "/:productId",
  validate(productValidate.productId),
  validate(productValidate.productInfor),
  product.updateProduct
);

export default productRouter;
