import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import validates from "../utils/validate";
import product from "../products/product.controller";

const productRouter = Router();
productRouter.post(
  "/add",
  auth.checkAuth,
  auth.checkExitsProduct,
  product.addProduct
);
productRouter.post("/delete", auth.checkAuth, product.deleteProduct);
productRouter.post("/update", auth.checkAuth, product.updateProduct);
productRouter.post("/get", auth.checkAuth, product.getProduct);

export default productRouter;
