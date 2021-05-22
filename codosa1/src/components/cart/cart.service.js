import cartModel from "./cart.model";
import { BaseService } from "../utils/BaseService";

//export default new BaseService(cartModel);
export const cartService = { 
  ...BaseService(cartModel) 
};