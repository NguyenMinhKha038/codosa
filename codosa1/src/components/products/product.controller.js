import category from "../category/category.model";
import product from "../products/product.model";
const addProduct = async (req, res) => {
  const { name, amount, price, categoryName, description } = req.body;
  const products = await product.findOne({ name: name });
  if (products) {
    res.status(403).json({ message: "Đã tồn tại" });
  }
  let products = new product({
    name: name,
    amount: amount,
    price: price,
    category: categoryName,
    description: description,
    status:"Active"
  });

  try {
    const checkCategory = await category.findOne({ name: categoryName });
    if (!checkCategory) {
      let categories = new category({
        name: categoryName,
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
  if (!name) {
    res.status(400).json({ message: "Tên sản phẩm trống" });
  } else {
    const products = await product.find({ name: name });
    if (products) {
      res.status(200).json({
        name: products[0].name,
        amount: products[0].amount,
        price: products[0].price,
      });
    } else {
      res.status(400).json({ message: "Không tồn tại sản phẩm" });
    }
  }
};
const deleteProduct = async (req, res) => {
  const name = req.body.name;
  try {
    await product.findOneAndUpdate({ name: name },{status:"Disable"});
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
