import { express, Router } from "express";
import auth from "../common/auth";
import categoryController from "../category/category.controller";

const categoryRouter = Router();
categoryRouter.post(
  "/add",
  auth.checkAuth,
  auth.checkExitsCategory,
  categoryController.addCategory
);
categoryRouter.post(
  "/delete",
  auth.checkAuth,
  categoryController.deleteCategory
);
categoryRouter.post(
  "/update",
  auth.checkAuth,
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
  categoryController.getAllProduct
);
export default categoryRouter;
