import productModel from "../products/product.model";
import {reponseSuccess} from "../error/baseResponese";
import {baseError} from "../error/baseError";
import {errorList} from "../error/errorList"
import statusCode from "../error/statusCode"

 const search = async (req, res, next) => {
  const {page,perPage} = req.query;
  const name = req.body.name;
  const products = await productModel
    .find({
      name: { $regex: name, $options: "$i" },
    })
    .skip(page > 0 ? (page - 1) * perPage : 0)
    .limit(Number(perPage));
  let arrProduct = products.map((x) => x);
  if (arrProduct.length == 0) {
    throw new baseError(name,statusCode.NOT_FOUND,errorList.FIND_ERROR);
  }
  reponseSuccess(res,arrProduct);
};

export default {search};
