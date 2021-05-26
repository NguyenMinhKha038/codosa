import cartModel from "./cart.model";
import { baseService } from "../utils/baseService";

export const cartService = { 
  ...baseService(cartModel) 
};