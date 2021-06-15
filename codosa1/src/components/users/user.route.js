import userController from "../users/user.controller";
import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import userValidate from "./user.validate";
import permission from "../utils/permission"
import baseValidate from "../utils/validate"

const userRouter = Router();
const adminRouter= Router();
userRouter.post(
  "/login",
  validate(baseValidate.validateLogin),
  userController.userLogin
);
userRouter.post(
  "/register",
  validate(baseValidate.validateRegister),
  userController.userRegister
);
userRouter.get("/me", auth.passport, auth.authenticate([permission.USER]), userController.getInfo);
adminRouter.use(auth.passport, auth.authenticate([permission.MANAGER,permission.STAFF]))
adminRouter.delete(
  "/:id",
  baseValidate.validateId,
  userController.adminDeleteUser
);
adminRouter.put(
  "/:id",
  baseValidate.validateId,
  validate(baseValidate.validateNamePass),
  userController.adminUpdateUser
);
adminRouter.get(
  "/:id",
  baseValidate.validateId,
  userController.adminGetUser
);
userRouter.use("/admin",adminRouter)
export default userRouter;
