import product from "../products/product.model";

const search = async (req, res, next) => {
  const page = req.params.page;
  const perPage = 5;
  const name = req.body.name;
  const products = await product
    .find({
      name: { $regex: name, $options: "$i" },
    })
    .skip(page > 0 ? (page - 1) * perPage : 0)
    .limit(perPage);
    console.log(products)
  let arrProduct = products.map((x) => x.name);

  if (arrProduct.length == 0) {
    res.status(400).json({ Message: "Product not found" });
  }
  res.status(200).json({ Product: arrProduct });
};

export default { search };
