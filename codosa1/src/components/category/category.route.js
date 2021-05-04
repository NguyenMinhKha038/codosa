import { express, Router } from "express";
import auth from "../utils/auth";
import categoryController from "../category/category.controller";
import categoryValidate from "./category.validate"

const categoryRouter = Router();
categoryRouter.post(
  "/add",
  auth.checkAuth,
  categoryValidate.categoryValidate,
  categoryController.addCategory
);
categoryRouter.post(
  "/delete",
  auth.checkAuth,
  categoryValidate.categoryValidate,
  categoryController.deleteCategory
);
categoryRouter.post(
  "/update",
  auth.checkAuth,
  categoryValidate.categoryUpdateValidate,
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
  categoryValidate.categoryValidate,
  categoryController.getAllProduct
);
export default categoryRouter;
