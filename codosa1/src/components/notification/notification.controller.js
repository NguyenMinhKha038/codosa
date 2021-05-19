import notification from "./notification.model";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {reponseSuccess} from "../error/baseResponese";

const getNotification = async (req, res,next) => {
  const {page,perPage} = req.params.page;
  try {
    const notifications = await notification.find().populate('orderId') .skip(page > 0 ? (page - 1) * perPage : 0)
    .limit(perPage);;
    if(!notifications){
      throw new baseError("Notification",statusCode.NOT_FOUND,errorList.FIND_ERROR)
    }
    reponseSuccess(res,notifications);
  } catch (error) {
    next(error);
  }
};
export default { getNotification };
