import { express, Router } from "express";
import searchController from "../search/search.controller";
import searchReport from "./search.validate";

const searchRoute = Router();
searchRoute.post("/search", searchReport.checkNameSearch,searchController.search);
export default searchRoute;
