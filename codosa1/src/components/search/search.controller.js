import { responseSuccess } from "../error/baseResponese";
import { BaseError } from "../error/BaseError";
import { errorList } from "../error/errorList";
import statusCode from "../error/statusCode";
import { productService } from "../products/product.service";

const search = async (req, res, next) => {
  try {
    const { page, perPage } = req.params;
    const name = req.body.name;
    const product = await productService.get(
      {
        name: { $regex: name, $options: "$i" },
      },
      ["name", "quantity", "price"],

      { limit: Number(perPage), skip: page > 0 ? (page - 1) * perPage : 0 }
    );
    let arrProduct = product.map((x) => x);
    if (arrProduct.length === 0) {
      throw new BaseError({
        name: name,
        httpCode: statusCode.NOT_FOUND,
        description: errorList.FIND_ERROR,
      });
    }
    responseSuccess(res,200, arrProduct);
  } catch (error) {
    next(error);
  }
};
export default { search };
