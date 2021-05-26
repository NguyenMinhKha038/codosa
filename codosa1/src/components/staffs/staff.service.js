import staffModel from "./staff.model";
import {baseService} from "../utils/baseService"

// class staffService extends baseService{
//   constructor(){
//     super(staffModel);
//   }
// }
// export default new staffService(staffModel)


export const staffService = { 
  ...baseService(staffModel) 
};
