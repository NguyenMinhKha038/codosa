import userController from "../users/user.controller";
import validationResult from "express-validator";
import { express, Router } from "express";
import Auth from "../common/Auth";
const userRouter = Router();
userRouter.post("/login", validate.Auth.Validate(), userController.userLogin);
userRouter.get("/test", Auth.isUser, userController.testToken);
userRouter.post("/register", userController.userRegister);
userRouter.get("*", (req, res) => {
  res.send("page node found");
});
export default userRouter;
