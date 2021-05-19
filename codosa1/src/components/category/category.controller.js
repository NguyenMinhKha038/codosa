import category from "./category.model";
import product from "../products/product.model";
import statusMiddleWare from "../utils/status";

const addCategory = async (req, res, next) => {
  try {
    const categoryName = req.body.category;
    const checkCategory = await category.findOne({ name: categoryName });
    if (checkCategory) {
      return res.status(403).json({ message: "Already exist" });
    }
    let categories = new category({
      name: categoryName,
      status: statusMiddleWare.categoryStatus.ACTIVE,
    });

    await categories.save();
    return res.status(200).json({ name: categoryName });
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  const categories = req.body.category;
  await Promise.all(
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
      return res.status(200).json({ message: "Delete successful" });
    })
    .catch((error) => {
      next(error);
    });
};
const getListCategory = async (req, res, next) => {
  try {
    const categories = await category.find({});
    let list = categories.map((x) => x._id);
    if (list.length == 0) {
      return res.status(200).json({ message: "Cant not found" });
    }
    res.status(200).json({ category: categories });
  } catch (error) {
    next(error);
  }
};
const getAllProduct = async (req, res) => {
  try {
    const categories = req.body.category;
    const listProduct = await product.findMany({ category: categories });
    if (listProduct.length == 0) {
      return res.status(200).json({ Message: "Cant not found" });
    }
    return res.status(200).json({ Product: listProduct });
  } catch (error) {
    next(error);
  }
};
const updateCategory = async (req, res,next) => {
  try {
    const { name, newName } = req.body;
    await Promise.all(
      category.findOneAndUpdate({ name: name }, { name: newName }),
      product.updateMany({ category: name }, { category: newName })
    );
    return res.status(200).json({ message: { name: name, newName: newName } });
  } catch (error) {
    next(error);
  }
};
export default {
  addCategory,
  deleteCategory,
  getListCategory,
  updateCategory,
  getAllProduct,
};
