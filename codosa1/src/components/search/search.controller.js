import { reponseSuccess } from "../error/baseResponese";
import { baseError } from "../error/baseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import productService from "../products/product.service";

const search = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const name = req.body.name;
    const products = await productService.search(name, page, perPage);
    let arrProduct = products.map((x) => x);
    if (arrProduct.length == 0) {
      throw new baseError(name, statusCode.NOT_FOUND, errorList.FIND_ERROR);
    }
    reponseSuccess(res, arrProduct);
  } catch (error) {
    next(error);
  }
};

export default { search };
