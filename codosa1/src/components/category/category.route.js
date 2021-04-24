import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../common/auth";
import validates from "../common/validate";
import product from "../products/product.controller";
import categoryController from "../category/category.controller"

const categorytRouter = Router();
categorytRouter.post("/add",auth.checkAuth,auth.checkExitsCategory,categoryController.addCategory);
categorytRouter.post("/delete",auth.checkAuth,categoryController.deleteCategory);
categorytRouter.post("/update",auth.checkAuth,categoryController.updateCategory);
categorytRouter.get("/getcategory",auth.checkAuth,categoryController.getListCatagory);
categorytRouter.post("/getproduct",auth.checkAuth,categoryController.getAllProduct);
export default categorytRouter;
