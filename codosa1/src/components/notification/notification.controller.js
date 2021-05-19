import notification from "./notification.model";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {baseRes} from "../error/baseRes";

const getNotification = async (req, res,next) => {
  const {page,perPage} = req.params.page;
  try {
    const notifications = await notification.find().populate('orderId') .skip(page > 0 ? (page - 1) * perPage : 0)
    .limit(perPage);;
    if(!notifications){
      throw new baseError("Notification",statusCode.NOT_FOUND,errorList.foundError)
      //return res.status(400).json({ Message: "No such notification found" });
    }
    baseRes(res,statusCode.OK,notifications,"Successful");
    //return res.status(200).json({ Notification: notifications });
  } catch (error) {
    next(error);
  }
};
export default { getNotification };
