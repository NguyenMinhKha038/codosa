import managerModel from "./manager.model";
import {BaseService} from "../utils/BaseService"

// class managerService extends BaseService{
//   constructor(){
//     super(managerModel);
//   }
// }
// export default new managerService(managerModel)


// export const managerService =(managerModel)=> {
//   [...BaseService(managerModel)]
// };
export const managerService = { 
  ...BaseService(managerModel) 
};