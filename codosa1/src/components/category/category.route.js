import { express, Router } from "express";
import auth from "../utils/auth";
import categoryController from "../category/category.controller";
import categoryValidate from "./category.validate";
import { validate, ValidationError, Joi } from "express-validation";
const categoryRouter = Router();
categoryRouter.use(auth.passport,auth.isManagerOrStaff);
categoryRouter.post(
  "/",
  validate(categoryValidate.categoryValidate),
  categoryController.addCategory
);
categoryRouter.delete(
  "/:id",
  categoryValidate.validateId,
  categoryController.deleteCategory
);
categoryRouter.put(
  "/:id",
  validate(categoryValidate.updateCategory),
  categoryValidate.validateId,
  categoryController.updateCategory
);
categoryRouter.get("/", categoryController.getListCategory);
categoryRouter.get(
  "/product/:id",
  categoryValidate.validateId,
  categoryController.getAllProduct
);
export default categoryRouter;
