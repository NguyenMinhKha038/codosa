import { express, Router } from "express";
import auth from "../utils/auth";
import categoryController from "../category/category.controller";
import categoryValidate from "./category.validate"
import { validate, ValidationError, Joi } from "express-validation";

const categoryRouter = Router();
categoryRouter.post(
  "/add",
  auth.checkAuth,
  validate(categoryValidate.categoryValidate, {}, {}),
  categoryController.addCategory
);
categoryRouter.post(
  "/delete",
  auth.checkAuth,
  validate(categoryValidate.categoryValidate, {}, {}),
  categoryController.deleteCategory
);
categoryRouter.post(
  "/update",
  auth.checkAuth,
  validate(categoryValidate.updateCategory, {}, {}),
  categoryController.updateCategory
);
categoryRouter.get(
  "/getcategory",
  auth.checkAuth,
  categoryController.getListCategory
);
categoryRouter.post(
  "/getproduct",
  auth.checkAuth,
  validate(categoryValidate.categoryValidate, {}, {}),
  categoryController.getAllProduct
);
export default categoryRouter;
