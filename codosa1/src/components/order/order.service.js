import orderModel from "./order.model";
import {BaseService} from "../utils/BaseService"

// class orderService extends BaseService{
//   constructor(){
//     super(orderModel);
//   }
// }
// export default new orderService(orderModel)
export const orderService = { 
  ...BaseService(orderModel) 
};
