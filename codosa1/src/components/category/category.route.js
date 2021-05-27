import { express, Router } from "express";
import auth from "../utils/auth";
import categoryController from "../category/category.controller";
import categoryValidate from "./category.validate";
import { validate, ValidationError, Joi } from "express-validation";
import permission from "../utils/permission"
const categoryRouter = Router();
categoryRouter.use(auth.passport,auth.authenticate([permission.MANAGER,permission.STAFF]));
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
