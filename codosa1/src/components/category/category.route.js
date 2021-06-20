import { express, Router } from "express";
import auth from "../utils/auth";
import categoryController from "../category/category.controller";
import categoryValidate from "./category.validate";
import { validate, ValidationError, Joi } from "express-validation";
import permission from "../utils/permission"
const categoryRouter = Router();
categoryRouter.get(
  "/allproduct",
  validate(categoryValidate.validateCategoryIdInQuery),
  categoryController.getAllProduct
);
categoryRouter.use(auth.passport,auth.authenticate([permission.MANAGER,permission.STAFF]));
categoryRouter.post(
  "/",
  validate(categoryValidate.categoryValidate),
  categoryController.addCategory
);
categoryRouter.delete(
  "/:categoryId",
  validate(categoryValidate.validateCategoryIdInParams),
  categoryController.deleteCategory
);
categoryRouter.put(
  "/:categoryId",
  validate(categoryValidate.updateCategory),
  validate(categoryValidate.validateCategoryIdInParams),
  categoryController.updateCategory
);
categoryRouter.get("/", categoryController.getListCategory);

export default categoryRouter;
