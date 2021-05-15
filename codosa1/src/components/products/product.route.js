import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import validates from "../utils/validate";
import product from "../products/product.controller";
import productValidate from "./product.validate";
import errorHandller from "../utils/errorHandller"

const productRouter = Router();
productRouter.post(
  "/add",
  auth.passportStaff,
  auth.isStaff,
  validate(productValidate.checkAddProduct),
  errorHandller(product.addProduct)
);
productRouter.delete("/delete", auth.passportStaff,auth.isStaff, validate(productValidate.checkNameProduct),errorHandller(product.deleteProduct));
productRouter.put("/update", auth.passportStaff,auth.isStaff,validate(productValidate.checkUpdateProduct,),errorHandller(product.updateProduct));
productRouter.post("/get",  auth.passportStaff,auth.isStaff,validate(productValidate.checkNameProduct), errorHandller(product.getProduct));

export default productRouter;
