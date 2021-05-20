import notificationModel from "./notification.model";
import {BaseService} from "../utils/BaseService"

class notificationService extends BaseService{
  constructor(){
    super(notificationModel);
  }
  async getAllNotification(populate,page,perPage){
    try {
      let item = await this.model.find().populate(populate).skip(page > 0 ? (page - 1) * perPage : 0)
      .limit(Number(perPage));
      return item;
    } catch (error) {
      throw error
    }
  }
}
export default new notificationService(notificationModel)