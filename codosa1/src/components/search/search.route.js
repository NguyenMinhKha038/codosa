import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import searchController from "../search/search.controller";
import searchValidate from "./search.validate";
const searchRoute = Router();
searchRoute.get("/", validate(searchValidate.validateSearch),searchController.search);
export default searchRoute;
