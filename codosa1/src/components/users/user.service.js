import userModel from "./user.model";
import {BaseService} from "../utils/BaseService";

//export default new BaseService(userModel)
// class userService extends BaseService{
//   constructor(){
//     super(userModel);
//   }

// }
//export default new userService(userModel)

export const userService = { 
  ...BaseService(userModel) 
};

