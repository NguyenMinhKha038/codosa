import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { responseSuccess } from "../error/baseResponese";
import { notificationService } from "./notification.service";

const getNotification = async (req, res, next) => {
  const { page, perPage } = req.params;
  try {
    const notifications = await notificationService.get(null, null, {
      skip: page > 0 ? (page - 1) * perPage : 0,
      limit: Number(perPage),
      populate: "orderId",
    });
    if (!notifications) {
      throw new BaseError({
        name: "Notification",
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res, 200, notifications);
  } catch (error) {
    next(error);
  }
};
export default { getNotification };
