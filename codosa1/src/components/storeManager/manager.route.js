import { validate, ValidationError, Joi } from "express-validation";
import { express, Router } from "express";
import auth from "../utils/auth";
import managerController from "./manager.controller";
import managerValidate from "./manager.validate";
import permission from "../utils/permission"
import baseValidate from "../utils/validate";
const managerRouter = Router();
const CRUDuserRouter = Router();
const CRUDstaffRouter = Router();
managerRouter.post(
  "/register",
  validate(baseValidate.validateRegister),
  managerController.managerRegister
);
managerRouter.post(
  "/login",
  validate(baseValidate.validateLogin),  //chu dat ten validate vd validate =login
  managerController.managerLogin
);
managerRouter.get("/me",auth.passport, auth.authenticate([permission.MANAGER]), managerController.getInfo);
//manager CRUD user
managerRouter.use("/user",CRUDuserRouter);
CRUDuserRouter.use(auth.passport, auth.authenticate([permission.MANAGER]));
CRUDuserRouter.delete(
  "/:id",
  baseValidate.validateId,
  managerController.deleteUser
);
CRUDuserRouter.get(
  "/:id",
  baseValidate.validateId,
  managerController.getUser
);
CRUDuserRouter.put(
  "/:id",
  baseValidate.validateId,
  validate(managerValidate.EmailNamePass),
  managerController.updateUser
);
//manager CRUD staff
managerRouter.use("/staff",CRUDstaffRouter)
CRUDstaffRouter.delete(
  "/:id",
  baseValidate.validateId,
  managerController.deleteStaff
);
CRUDstaffRouter.put(
  "/:id",
  baseValidate.validateId,
  validate(managerValidate.EmailNamePass),
  managerController.updateStaff
);
CRUDstaffRouter.get(
  "/:id",
  baseValidate.validateId,
  managerController.getStaff
);

export default managerRouter;
