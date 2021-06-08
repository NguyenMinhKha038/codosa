import logger from "../logger/createLogger";
const responseSuccess = (res, httpCode,data) => {
  //const statusCode = JSON.stringify(httpCode);
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
