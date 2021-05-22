const responseSuccess = (res, data) => {
  const httpCode = 200;
  const message = "Successful";
  return res.status(httpCode).json({ data: data, message: message });
};
export { responseSuccess };
