import category from "../category/category.model";
import product from "../products/product.model";
const addProduct = async (req, res) => {
  const { name, amount, price, categoryName, description } = req.body;
  let products = new product({
    name: name,
    amount: amount,
    price: price,
    category: category,
    description: description,
  });

  try {
    const checkCategory = await category.findOne({ name: categoryName });
    if (!checkCategory) {
      let categories = new category({
        name: category,
      });
      await categories.save();
    }
    await products.save();

    res.status(200).json({ message: "Tạo thành công" });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

const getProduct = async (req, res) => {
  const name = req.body.name;
  const products = await product.find({ name: name });
  // if (products) {
  //   res.status(200).json({
  //     name: products.name,
  //     amount: products.amount,
  //     price: products.price,
  //   });
  // } else {
  //   res.status(400).json({ message: "Không tồn tại sản phẩm" });
  // }
  if (products) {
    res.status(200).json({
      name: products[0].name,
      amount: products[0].amount,
      price: products[0].price,
    });
  } else {
    res.status(400).json({ message: "Không tồn tại sản phẩm" });
  }
};
const deleteProduct = async (req, res) => {
  const name = req.body.name;
  try {
    await product.findOneAndDelete({ name: name });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};
const updateProduct = async (req, res) => {
  const { name, amount, price, newName } = req.body;
  try {
    await product.findOneAndUpdate(
      { name: name },
      { name: newName, amount: amount, price: price }
    );
    res.status(200).json({ message: "Update thành công" });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};

export default { addProduct, getProduct, deleteProduct, updateProduct };
