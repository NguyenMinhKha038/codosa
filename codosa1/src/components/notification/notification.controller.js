import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {reponseSuccess} from "../error/baseResponese";
import notificationService from "./notification.service"

const getNotification = async (req, res,next) => {
  const {page,perPage} = req.params;
  console.log(page);
  console.log(perPage)
  try {
    const notifications = await notificationService.getAllNotification("orderId",page,perPage)
    if(!notifications){
      throw new baseError("Notification",statusCode.NOT_FOUND,errorList.FIND_ERROR)
    }
    reponseSuccess(res,notifications);
  } catch (error) {
    next(error);
  }
};
export default { getNotification };
