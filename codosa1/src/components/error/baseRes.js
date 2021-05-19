const baseRes = (res,statusCode,data,message)=>{
  return res.status(statusCode).json({data:data,message:message});
}
export { baseRes};

