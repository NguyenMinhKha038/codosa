import userModel from "./user.model";
import baseService from "../utils/baseService"

export class userService extends baseService{
  constructor(){
    super(userModel);
  }
}