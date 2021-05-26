import userModel from "./user.model";
import {baseService} from "../utils/baseService";

//export default new baseService(userModel)
// class userService extends baseService{
//   constructor(){
//     super(userModel);
//   }

// }
//export default new userService(userModel)

export const userService = { 
  ...baseService(userModel) 
};

