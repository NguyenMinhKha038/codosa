import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import managerController from "./manager.controller";
import managerValidate from "./manager.validate";
const managerRouter = Router();
const CRUDuserRouter = Router();
const CRUDstaffRouter = Router();
managerRouter.post(
  "/register",
  validate(managerValidate.EmailNamePass),
  managerController.managerRegister
);
managerRouter.post(
  "/login",
  validate(managerValidate.EmailPass),
  managerController.managerLogin
);
managerRouter.get("/me",auth.passport, auth.isManager, managerController.getInfo);
//manager CRUD user
managerRouter.use("/user",CRUDuserRouter);
CRUDuserRouter.use(auth.passport, auth.isManager);
CRUDuserRouter.delete(
  "/:id",
  managerValidate.validateId,
  managerController.deleteUser
);
CRUDuserRouter.get(
  "/:id",
  managerValidate.validateId,
  managerController.getUser
);
CRUDuserRouter.put(
  "/:id",
  managerValidate.validateId,
  validate(managerValidate.EmailNamePass),
  managerController.updateUser
);
//manager CRUD staff
managerRouter.use("/staff",CRUDstaffRouter)
CRUDstaffRouter.delete(
  "/:id",
  managerValidate.validateId,
  managerController.deleteStaff
);
CRUDstaffRouter.put(
  "/:id",
  managerValidate.validateId,
  validate(managerValidate.EmailNamePass),
  managerController.updateStaff
);
CRUDstaffRouter.get(
  "/:id",
  managerValidate.validateId,
  managerController.getStaff
);

export default managerRouter;
