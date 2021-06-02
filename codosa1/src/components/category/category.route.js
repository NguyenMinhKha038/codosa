import { express, Router } from "express";
import auth from "../utils/auth";
import categoryController from "../category/category.controller";
import categoryValidate from "./category.validate";
import { validate, ValidationError, Joi } from "express-validation";
import permission from "../utils/permission"
import baseValidate from "../utils/validate"
const categoryRouter = Router();
categoryRouter.use(auth.passport,auth.authenticate([permission.MANAGER,permission.STAFF]));
categoryRouter.post(
  "/",
  validate(categoryValidate.categoryValidate),
  categoryController.addCategory
);
categoryRouter.delete(
  "/:categoryId",
  baseValidate.validateId,
  categoryController.deleteCategory
);
categoryRouter.put(
  "/:categoryId",
  validate(categoryValidate.updateCategory),
  baseValidate.validateId,
  categoryController.updateCategory
);
categoryRouter.get("/", categoryController.getListCategory);
categoryRouter.get(
  "/product/:categoryId",
  baseValidate.validateId,
  categoryController.getAllProduct
);
export default categoryRouter;
