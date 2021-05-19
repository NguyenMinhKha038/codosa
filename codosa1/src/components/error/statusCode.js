const statusCodes = {
  OK: 200,
  Created:201, //Trả về khi một Resouce vừa được tạo thành công.
  No_Content:204, //Trả về khi Resource xoá thành công.
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  ALREADY_EXITS:403,
  Unauthorized:401

 }
 
export default statusCodes;