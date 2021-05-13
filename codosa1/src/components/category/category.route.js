import { express, Router } from "express";
import auth from "../utils/auth";
import categoryController from "../category/category.controller";
import categoryValidate from "./category.validate";
import { validate, ValidationError, Joi } from "express-validation";
import errorHandller from "../utils/errorHandller";

const categoryRouter = Router();
categoryRouter.post(
  "/add",
  auth.checkAuth,
  validate(categoryValidate.categoryValidate),
  errorHandller(categoryController.addCategory)
);
categoryRouter.post(
  "/delete",
  auth.checkAuth,
  validate(categoryValidate.categoryValidate),
  errorHandller(categoryController.deleteCategory)
);
categoryRouter.post(
  "/update",
  auth.checkAuth,
  validate(categoryValidate.updateCategory),
  errorHandller(categoryController.updateCategory)
);
categoryRouter.get(
  "/getcategory",
  auth.checkAuth,
  errorHandller(categoryController.getListCategory)
);
categoryRouter.post(
  "/getproduct",
  auth.checkAuth,
  validate(categoryValidate.categoryValidate),
  errorHandller(categoryController.getAllProduct)
);
export default categoryRouter;
