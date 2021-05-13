import category from "./category.model";
import product from "../products/product.model";
import statusMiddleWare from "../utils/status";

const addCategory = async (req, res) => {
  const categoryName = req.body.category;
  const checkCategory = await category.findOne({ name: categoryName });
  if (checkCategory) {
    res.status(403).json({ message: "Already exist" });
  }
  let categories = new category({
    name: categoryName,
    status: statusMiddleWare.categoryStatus.ACTIVE,
  });
  try {
    await categories.save();
    res.status(200).json({ massage: "Successful" });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};
const deleteCategory = async (req, res) => {
  const categories = req.body.category;

  Promise.all(
    category.findOneAndUpdate(
      { name: categories },
      { status: statusMiddleWare.categoryStatus.DISABLE }
    ),
    product.updateMany(
      { category: categories },
      { status: statusMiddleWare.categoryStatus.DISABLE }
    )
  )
    .then((value) => {
      res.status(200).json({ message: "Delete successful" });
    })
    .catch((error) => {
      res.status(400).json({ Error: error });
    });
};
const getListCategory = async (req, res) => {
  const categories = await category.find({});
  let list = categories.map((x) => x._id);
  if (list.length == 0) {
    res.status(200).json({ message: "Cant not found" });
  }
  res.status(200).json({ category: categories });
};
const getAllProduct = async (req, res) => {
  const category = req.body.category;
  try {
    const listProduct = await product.findMany({ category: category });
    if (listProduct.length == 0) {
      res.status(200).json({ Message: "Cant not found" });
    }
    res.status(200).json({ Product: listProduct });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};
const updateCategory = async (req, res) => {
  const { name, newName } = req.body;
  try {
    await category.findOneAndUpdate({ name: name }, { name: newName });
    await product.updateMany({ category: name }, { category: newName });
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
};
export default {
  addCategory,
  deleteCategory,
  getListCategory,
  updateCategory,
  getAllProduct,
};
