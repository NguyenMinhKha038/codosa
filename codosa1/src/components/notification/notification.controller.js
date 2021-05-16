import notification from "./notification.model";

const getNotification = async (req, res,next) => {
  try {
    const notifications = await notification.find().populate('orderId');
    if(!notifications){
      res.status(400).json({ Message: "No such notification found" });
    }
    res.status(200).json({ Notification: notifications });
  } catch (error) {
    next(error);
  }
};
export default { getNotification };
