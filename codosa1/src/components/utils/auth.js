import passportModule from "passport";
import passportMidleware from "./passport";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
const passport = (req, res, next) => {
  return passportModule.authenticate("user", { session: false })(
    req,
    res,
    next
  );
};
const authenticate = (roleCheck) => {
  return (req, res, next) => {
    try {
      const role = req.user.role;
      if (roleCheck.includes(role)) {
        next();
      } else {
        throw new BaseError({
          name: role,
          httpCode: statusCode.Unauthorized,
          description: errorList.AUTHENTICATE_FAILD,
        });
      }
    } catch (error) {
      next(error);
    }
  };
};
export default {
  authenticate,
  passport,
};
