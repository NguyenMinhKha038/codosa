import staffModel from "./staff.model";
import {BaseService} from "../utils/BaseService"

class staffService extends BaseService{
  constructor(){
    super(staffModel);
  }
}
export default new staffService(staffModel)