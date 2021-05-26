import managerModel from "./manager.model";
import { baseService } from "../utils/baseService";

// class managerService extends baseService{
//   constructor(){
//     super(managerModel);
//   }
// }
// export default new managerService(managerModel)

// export const managerService =(managerModel)=> {
//   [...baseService(managerModel)]
// };
export const managerService = {
  ...baseService(managerModel),
};
