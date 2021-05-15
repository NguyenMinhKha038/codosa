import notification from "./notification.model";

const getNotification = async (req, res,next) => {
  try {
    const notifications = await notification.find();
    if(!notifications){
      req.status(400).json({ Message: "No such notification found" });
    }
    req.status(200).json({ Notification: notifications });
  } catch (error) {
    next(error);
  }
};

export default { getNotification };
