import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import searchController from "../search/search.controller";
import searchValidate from "./search.validate";
const searchRoute = Router();
searchRoute.get("/search/", validate(searchValidate.nameSearch),searchController.search);
export default searchRoute;
