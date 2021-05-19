import product from "../products/product.model";
import {baseRes} from "../error/baseRes";
import {baseError} from "../error/baseError";
import {errorList} from "../error/errorList"
import statusCode from "../error/statusCode"

 const search = async (req, res, next) => {
  const {page,perPage} = req.query;
  const name = req.body.name;
  const products = await product
    .find({
      name: { $regex: name, $options: "$i" },
    })
    .skip(page > 0 ? (page - 1) * perPage : 0)
    .limit(Number(perPage));
  let arrProduct = products.map((x) => x);

  if (arrProduct.length == 0) {
    //return res.status(400).json({ message: "Product not found" });
    throw new baseError(name,statusCode.NOT_FOUND,errorList.foundError,true);
  }
  baseRes(res,200,arrProduct,"Successfull")
};

export default {search};
