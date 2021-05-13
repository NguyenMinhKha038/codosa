import notification from "./notification.model";

const getNotification = async (req, res) => {
  try {
    const notifications = await notification.find();
    req.status(200).json({ Notification: notifications });
  } catch (error) {
    req.status(400).json({ Error: error });
  }
};

export default { getNotification };
