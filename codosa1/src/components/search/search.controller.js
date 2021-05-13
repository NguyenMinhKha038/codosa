import { Error } from "mongoose";
import product from "../products/product.model";

const search = async (req, res, next) => {
  const name = req.body.name;
  const products = await product.find({
    name: { $regex: name, $options: "$i" },
  });
  let arrProduct = products.map((x) => x.name);

  if (arrProduct.length == 0) {
    res.status(200).json({ Message: "Product not found" });
  }
  res.status(200).json({ Product: arrProduct });
};

export default { search };
