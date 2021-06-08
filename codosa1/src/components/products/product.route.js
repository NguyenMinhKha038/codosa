import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import product from "../products/product.controller";
import productValidate from "./product.validate";
import permission from "../utils/permission";
import baseValidate from "../utils/validate";

const productRouter = Router();
productRouter.use(auth.passport,auth.authenticate([permission.MANAGER,permission.STAFF]))
productRouter.post(
  "/",
  baseValidate.validateId,
  validate(productValidate.productInfor),
  product.addProduct
);
productRouter.delete(
  "/:productId",
  baseValidate.validateId,
  product.deleteProduct
);
productRouter.put(
  "/:productId",
  baseValidate.validateId,
  validate(productValidate.productInfor),
  product.updateProduct
);
productRouter.get(
  "/:productId",
  baseValidate.validateId,
  product.getProduct
);
productRouter.post("/category",validate(productValidate.categoryId),product.getAllByCategory);



export default productRouter;
