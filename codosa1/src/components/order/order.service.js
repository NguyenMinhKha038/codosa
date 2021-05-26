import orderModel from "./order.model";
import {baseService} from "../utils/baseService"

// class orderService extends baseService{
//   constructor(){
//     super(orderModel);
//   }
// }
// export default new orderService(orderModel)
export const orderService = { 
  ...baseService(orderModel) 
};
