import logger from "../logger/createLogger";
const responseSuccess = (res, data) => {
  const httpCode = 200;
  const message = "Successful";
  return (
    res.status(httpCode).json({ data: data, message: message }),
    logger.log({
      level: "info",
      message: JSON.stringify(data),
    })
  );
};
export { responseSuccess };
