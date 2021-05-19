import { express, Router } from "express";
import auth from "../utils/auth";
import categoryController from "../category/category.controller";
import categoryValidate from "./category.validate";
import { validate, ValidationError, Joi } from "express-validation";
const categoryRouter = Router();
categoryRouter.post(
  "/add",
  validate(categoryValidate.categoryValidate),
  categoryController.addCategory
);
categoryRouter.delete(
  "/delete",
  validate(categoryValidate.categoryValidate),
  categoryController.deleteCategory
);
categoryRouter.put(
  "/update",
  validate(categoryValidate.updateCategory),
  categoryController.updateCategory
);
categoryRouter.get("/getcategory", categoryController.getListCategory);
categoryRouter.post(
  "/getproduct",
  validate(categoryValidate.categoryValidate),
  categoryController.getAllProduct
);
export default categoryRouter;
