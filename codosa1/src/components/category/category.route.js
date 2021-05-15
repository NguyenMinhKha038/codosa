import { express, Router } from "express";
import auth from "../utils/auth";
import categoryController from "../category/category.controller";
import categoryValidate from "./category.validate";
import { validate, ValidationError, Joi } from "express-validation";
import errorHandller from "../utils/errorHandller";

const categoryRouter = Router();
categoryRouter.post(
  "/add",
  auth.isStaff,
  validate(categoryValidate.categoryValidate),
  errorHandller(categoryController.addCategory)
);
categoryRouter.delete(
  "/delete",
  auth.isStaff,
  validate(categoryValidate.categoryValidate),
  errorHandller(categoryController.deleteCategory)
);
categoryRouter.put(
  "/update",
  auth.isStaff,
  validate(categoryValidate.updateCategory),
  errorHandller(categoryController.updateCategory)
);
categoryRouter.get(
  "/getcategory",
  auth.isStaff,
  errorHandller(categoryController.getListCategory)
);
categoryRouter.post(
  "/getproduct",
  auth.isStaff,
  validate(categoryValidate.categoryValidate),
  errorHandller(categoryController.getAllProduct)
);
export default categoryRouter;
