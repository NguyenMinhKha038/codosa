import { express, Router } from "express";
import { validate, ValidationError, Joi } from "express-validation";
import searchController from "../search/search.controller";
import searchValidate from "./search.validate";

const searchRoute = Router();
searchRoute.post("/search", validate(searchValidate.checkNameSearch, {}, {}),searchController.search);
export default searchRoute;
