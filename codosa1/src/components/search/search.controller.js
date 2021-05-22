import { responseSuccess } from "../error/baseResponese";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import {productService} from "../products/product.service";

const search = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const name = req.body.name;
    const product = await productService.search(name, page, perPage);
    let arrProduct = product.map((x) => x);
    if (arrProduct.length == 0) {
      throw new BaseError({name:name, httpCode:statusCode.NOT_FOUND, description:errorList.FIND_ERROR});
    }
    responseSuccess(res, arrProduct);
  } catch (error) {
    next(error);
  }
};

export default { search };
