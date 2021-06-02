import { validate, ValidationError, Joi } from "express-validation";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
const nameSearch = {
  body: Joi.object({
    name: Joi.string()
      .required(),
  }),
};
const pagePerPage = (req, res, next) => {
  const { page, perPage } = req.params;
  if (isNaN(page ) || isNaN(perPage)) {
    throw new BaseError({
      name: req.params.id,
      httpCode: statusCode.BAD_REQUEST,
      description: errorList.VALIDATE_PAGE_PERPAGE,
    });
  }
  next();
};
export default { nameSearch, pagePerPage };
