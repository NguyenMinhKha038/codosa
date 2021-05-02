import { express, Router } from "express";
import searchController from "../search/search.controller";

const searchRoute = Router();
searchRoute.post("/search", searchController.search);
export default searchRoute;
