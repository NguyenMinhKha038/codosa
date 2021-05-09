import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import searchController from "../search/search.controller";
import searchValidate from "./search.validate";
import errorHandller from "../utils/errorHandller";
const searchRoute = Router();
searchRoute.post("/search", validate(searchValidate.checkNameSearch),errorHandller(searchController.search));
export default searchRoute;
